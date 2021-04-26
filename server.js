'use strict';
require('dotenv').config();
const { request, response } = require('express');
const express = require('express');
const server = express();
// const cors = cors();
const PORT = process.env.PORT || 5000;
server.get('/', (request, response) => {
  response.status(200).json();
  response.send('try another rout');
});

// server.use(cors());

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

function getDay (str){
  let newStr = str.substr(0,2);
  switch(newStr){
  case '13' : return 'Mon';

  case '14' : return 'Tue';

  case '15' : return 'Wed';

  case '16' : return 'Thu';

  case '17' : return 'Fri';

  default : return 'Error';
  }
}

function reverseDate (str){
  let newStr;
  newStr += str[8];
  newStr += str[9];
  newStr += str[7];
  newStr += str[5];
  newStr += str[6];
  newStr += str[4];
  newStr += str[0];
  newStr += str[1];
  newStr += str[2];
  newStr += str[3];

  return newStr;
}

let Weather = function (obj) {
  this.forecast = obj.weather.description;
  let date = obj.valid_date;
  let newDate = reverseDate(date);
  let day = getDay(newDate);
  this.time = day+newDate;
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
