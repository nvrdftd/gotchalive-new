var watson = require('watson-developer-cloud');
var config = require('../config/watson-config.js');
var conversation = watson.conversation(config.credentials);

var watson = function(req, res, next) {

  conversation.message({
    workspace_id: config.workspace_id,
    input: { 'text': req.body.input },
    context: req.body.context
  }, function(err, watsonResponse) {
    if (err) {
      console.log(err);
    } else {
      res.watsonResponse = watsonResponse;
      next();
    }
  });
}

module.exports = watson;
