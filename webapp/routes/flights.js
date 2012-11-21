
exports.create = function(req, res){
  
  var flightPersistence = require('../../flightPersistence');
  var from =  req.body.from;
  var to =  req.body.to;
  flightPersistence.createFlight(from, to);
  res.send("true"); 
};
