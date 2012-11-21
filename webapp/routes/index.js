
/*
 * GET home page.
 */

exports.index = function(req, res){
  var from =  req.params.from || "SEA";
  var to =  req.params.to || "ROC";
  var flightPersistence = require('../../flightPersistence');
  flightPersistence.getFlightId(from, to, function(id) {
    if (id) 
      res.render('index', { title: 'FlightScrape', flightId : id, from: from, to : to });
    else 
      res.render('create', { title: 'FlightScrape: Create flight', flightId : id, from: from, to : to });
  })
};
