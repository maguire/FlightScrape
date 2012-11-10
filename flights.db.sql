CREATE TABLE Flight(id INTEGER PRIMARY KEY ASC, from_airport VARCHAR(3), to_airport VARCHAR(3));
CREATE TABLE FlightPrices(id INTEGER PRIMARY KEY ASC, flight_date date, price int, price_request_id int);
CREATE TABLE PriceRequests(id INTEGER PRIMARY KEY ASC, day VARCHAR(10), time datetime default current_timestamp, flight_id int);
