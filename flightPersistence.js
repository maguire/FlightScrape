var sys    = require('util'),
    sqlite = require('sqlite-fts');

var db = new sqlite.Database();

exports.persistBestPrices = function(datePricePairs, flight) {
  db.open("flights", function (error) {
    if (error) {
      console.log("Error opening flights.db");
      throw error;
    }
    db.execute("INSERT INTO PriceRequests(day, flight_id) VALUES(?, ?)"
      , [new Date().getDay(), flight.id]
      , function(error, rows) {
          if (error) throw error;
          getLatestPriceRequestId(flight.id,
            function(priceReqId) {
                if(error) throw error;
                persistPrice(datePricePairs, priceReqId,  0);
            });
      });
  });
};

exports.getAllFlights = function(callback) {
  db.open("flights", function (error) {
    if (error) {
      console.log("Error opening flights.db");
      throw error;
    }
    db.execute("SELECT * FROM Flight" 
      , function(error, rows) {
          if(error) throw error;
          callback(rows);
      });
  });
}

exports.getLatestBestPrices = function(flightId, callback) {
  db.open("flights", function (error) {
    if (error) {
      console.log("Error opening flights.db");
      throw error;
    }
    getLatestPriceRequestId(flightId, function(id) {
      
      db.execute("SELECT flight_date,price FROM FlightPrices WHERE price_request_id = ?"
        , [id]
        , function(error, rows) {
            if(error) throw error;
            callback(rows);
        });
    });
  });
}

//db must be open to call this
var getLatestPriceRequestId = function(flightId, callback) {
  db.execute("SELECT ID FROM PriceRequests WHERE flight_id = ? ORDER BY ID DESC LIMIT 1"
    , [flightId]
    , function(error, rows) {
        if(error) throw error;
        var id =rows[0]['id'];
        callback(id); 
    })
};

//db must be open to call this
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
