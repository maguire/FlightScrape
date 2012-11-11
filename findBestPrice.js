var FlightResponseParser = {
    parse : function(json) {

        var response = eval(json);
        var flightInfo = eval(response[1][0][2])
        return flightInfo;
    },

    getDailyBestPrices : function(flights) {
        sortedByDate = flights[1].sort();
        datePrices = [];
        for (var x = 0; x < sortedByDate.length; x++) {
            datePrices[x] = {'date' : sortedByDate[x][1], 'price' : sortedByDate[x][3] }
        } 
        return datePrices;
    }
}

var from = '{FROM}'
var to = '{TO}'
var beginDate = new Date().toISOString().split('T')[0] //'2012-11-10'
var endDate = new Date(+new Date() + 60*86400000).toISOString().split('T')[0]

var flightPersistence = require('./flightPersistence');
var http = require('http');
var d = []
d[0] = ''
d[1] = '[,[[,"ca","[,[,,,,,,,,,,,,,,,,,,[[,[\\"'
d[2] = from
d[3] = '\\"]\\n,[\\"'
d[4] = to
d[5] = '\\"]\\n,\\"\\"]\\n]\\n]\\n,\\"'
d[6] = beginDate //2012-11-09
d[7] = '\\",\\"'
d[8] = endDate //2012-12-09
d[9] = '\\"]\\n",,4]],[,[[,"b_al","ld:135"],[,"b_am","ca"],[,"b_qu","0"],[,"b_qc","4"]]]]' 
var reqData = d.join('');

var options = {
  host: 'google.com',
  path: '/flights/rpc',
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded',
            'Accept' : '*/*',
            'X-GWT-Permutation':'AA0BE2EDE18DC4F0C784922828B2BA9F'} 
};

var getFlightsCallback = function(flights) {
  var curFlightIdx = 0;
  var create_callback = function(i) {
    return function(response) {
      var str = '';
      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        var flightObj = FlightResponseParser.parse(str);
        var dailyBestPrices = FlightResponseParser.getDailyBestPrices(flightObj)
        flightPersistence.persistBestPrices(dailyBestPrices, flights[i]);
      });
    }
  }
  
  for(curFlightIdx = 0; curFlightIdx < flights.length; curFlightIdx++) {
    var requestData = reqData.replace('{FROM}', flights[curFlightIdx].from_airport)
                             .replace('{TO}', flights[curFlightIdx].to_airport);
    options['headers']['Content-Length'] = requestData.length;
    var request = http.request(options, create_callback(curFlightIdx));
    request.end(requestData);
  }
};

flightPersistence.getAllFlights(getFlightsCallback);

