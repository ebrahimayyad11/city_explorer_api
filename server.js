'use strict';
const express=require('express');
require ('dotenv').config();
const cors =require('cors');


const server=express();
const PORT = process.env.PORT || 5000;
server.use(cors());




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
  this.time = new Date(obj.valid_date).toDateString();
};

server.get('/weather', (request, response) => {
  let arr = [];
  let weather = require('./data/weather.json');
  weather.data.forEach((item) => {
    let newWeather = new Weather(item);
    arr.push(newWeather);
  });
  response.status(200).send(arr);
});


server.get('*',(req,res)=>{
  let errObj = {
    status: 500,
    resText: 'sorry! this page not found'
  };
  res.status(500).send(errObj);
});



server.listen(PORT, () => {
  console.log(PORT);
});
