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


let Weather = function (description,date){
  this.forecast = description;
  this.time = new Date(date).toDateString();
};


server.get('/weather', (req, res) => {
  let key = process.env.WEATHER_API_KEY;
  let countryName = req.query.search_query;
  let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${countryName}&key=${key}`;
  superagent.get(weatherURL)
    .then(item => {
      let getData = item.body.data;
      let result = getData.map(items => {
        return new Weather(items.weather.description,items.datetime);
      });
      res.status(200).send(result);
    })

    .catch(error => {
      res.send(error);
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

function sumArr(arr){
  let sum = 0;
  arr.forEach(item => {
    sum += parseInt(item);
  });
  return sum;
}



let Park = function(obj){
  this.name = obj.fullName;

  this.address = obj.addresses[0].line1+','+obj.addresses[0].city+','+obj.addresses[0].stateCode
  +' '+obj.addresses[0].postalCode;

  let arr = obj.entranceFees;
  let newArr = [];
  arr.forEach(item => {
    newArr.push(item.cost);
  });
  this.fees = sumArr(newArr).toString()+'.00';

  this.description = obj.description;

  this.url = obj.url;

};

server.get('/parks', (req,res) => {
  let key = process.env.PARKS_API_KEY;
  let countryName = req.query.city;
  let parkURL = `https://developer.nps.gov/api/v1/parks?q=${countryName}&api_key=${key}`;
  superagent.get(parkURL)
    .then(item => {
      let getData = item.body.data;
      let result = [];
      getData.forEach(items => {
        result.push(new Park(items));
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
