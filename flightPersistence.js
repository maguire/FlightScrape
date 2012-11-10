var sys    = require('util'),
    sqlite = require('sqlite-fts');

var db = new sqlite.Database();

exports.persistBestPrices = function(datePricePairs) {
  db.open("flights", function (error) {
    if (error) {
      console.log("Error opening flights.db");
      throw error;
    }
    db.execute("INSERT INTO PriceRequests(day, flight_id) VALUES(?, ?)"
      , [new Date().getDay(), 1]
      , function(error, rows) {
          if (error) throw error;
          db.execute("SELECT ID FROM PriceRequests ORDER BY ID  DESC LIMIT 1"
            , function(error, rows) {
                if(error) throw error;
                var id =rows[0]['id'];
                persistPrice(datePricePairs, id,  0);
              });
      });
  });
};

var persistPrice = function(datePricePairs, request_id, index) {
  if (datePricePairs.length <= index) return;
  var current = datePricePairs[index];
  db.execute("INSERT INTO FlightPrices(flight_date, price, price_request_id) VALUES(?, ? ,?)"
    , [current['date'], current['price'], request_id]
    , function(error, row) {
      if(error) throw error;
      persistPrice(datePricePairs, request_id, index+1);
    }
  );
};
