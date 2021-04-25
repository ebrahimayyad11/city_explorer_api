'use strict';
require('dotenv').config();
const { request, response } = require('express');
const express = require('express');
const server = express();
const PORT = process.env.PORT || 5000;
server.get('/', (request, response) => {
  response.status(200).json();
  response.send('try another rout');
});


server.listen(PORT, () => {
  console.log(PORT);
});

let Location = function (obj) {
  let split = obj[0].display_name.split(' ');

  this.search_query = split[0];
  this.formatted_query = obj[0].display_name;
  this.latitude = obj[0].lat;
  this.longitude = obj[0].lon;
};


server.get('/location', (request, response) => {
  let location = require('./data/location.json');
  let newLocation = new Location(location);
  response.status(200).send(newLocation);
});


let Weather = function (obj) {
  this.forecast = obj.weather.description;
  this.time = obj.valid_date;
};

server.get('/weather', (request, response) => {
  let arr = [];
  let weather = require('./data/weather.json');
  weather.data.forEach((item) => {
    let newWeather = new Weather(item);
    arr.push(newWeather);
  });
  // console.log(arr);
  response.status(200).send(arr);
});


server.get('*',(req,res)=>{
  let errObj = {
    status: 500,
    resText: 'sorry! this page not found'
  };
  res.status(500).send(errObj);
});
