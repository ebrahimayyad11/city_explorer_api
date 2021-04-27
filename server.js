'use strict';

require('dotenv').config();
const cors = require("cors");
const express = require('express');
const server = express();
const superagent = require('superagent');
server.use(cors());

const PORT = process.env.PORT || 5000;

server.get('/', (request, response) => {



  response.status(200).json();
  response.send('try another rout');

});

server.use(cors());


let Weather = function (obj){
  this.forecast = obj.weather.description;
  this.time = obj.valid_date;
};


server.get('/weather', (req, res) => {
  let key = process.env.GEOCODE_API_KEY;
  let countryName = req.query.city;
  let locationURL = `https://api.weatherbit.io/v2.0/history/daily?country=${countryName}&&key=${key}`;
  superagent.get(locationURL)
    .then(item => {
      let getData = item.body;
      let result = getData.map(items => {
        return new Weather(items);
      });
      res.send(result);
    });
});



let Location = function (obj,name) {
  this.search_query = name;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
};


server.get('/location', (req, res) => {
  let key = process.env.GEOCODE_API_KEY;
  let countryName = req.query.city;
  let locationURL = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${countryName}&format=json`;
  superagent.get(locationURL)
    .then(item => {
      let getData = item.body;
      let result = getData.map(items => {
        return new Location(items,countryName);
      });
      res.send(result);
    });
});


server.get('/*' ,(req,res) => {
  res.send('error 404');
});

server.listen(PORT,() => {
  console.log(`listening to port ${PORT}`);
});
