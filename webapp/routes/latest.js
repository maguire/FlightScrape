
/*
 * GET users listing.
 */

exports.list = function(req, res){
  var id = req.params.id || 1; 
  var flightPersistence = require('../../flightPersistence');
  flightPersistence.getLatestBestPrices(id, function(latestBestPrices){
    res.send(JSON.stringify(latestBestPrices));
  });
};
