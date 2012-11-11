
/*
 * GET users listing.
 */

exports.show = function(req, res){
  var id = req.params.id || 1; 
  var flightPersistence = require('../../flightPersistence');
  
  if (req.query.dateTime) {
    flightPersistence.getBestPricesForDate(id, req.query.dateTime, function(bestPrices){
      res.send(JSON.stringify(bestPrices));
    });
  } else {
    flightPersistence.getLatestBestPrices(id, function(latestBestPrices){
      res.send(JSON.stringify(latestBestPrices));
    });
  }
};


