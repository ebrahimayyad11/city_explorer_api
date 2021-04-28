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








//Application dependencies
const express = require('express');
// Load Environment Variables from the .env file
require('dotenv').config();
const cors = require('cors');
const pg = require('pg');


//Application setupppp
const app = express();
app.use(cors());
const PORT = process.env.PORT || 8000;

const client = new pg.Client({ connectionString: process.env.DATABASE_URL,   ssl: { rejectUnauthorized: false } });


// ROUTES
app.get('/test', testHandler);
app.get('/add', addDataHandler);
app.get('/people',getDataHandler);
app.get('*', notFoundHandler); //Error Handler

// Routes Handlers
function testHandler(request, response) {
  response.status(200).send('ok');
}

function notFoundHandler(request, response) {
  response.status(404).send('not found !!');
}

//localhost:3010/add?first_name=roaa&last_name=AbuAleeqa
function addDataHandler(req,res){
  console.log(req.query);
  let firstName = req.query.first_name;
  let lastName = req.query.last_name;
  //safe values
  let SQL = `INSERT INTO people (first_name,last_name) VALUES ($1,$2) RETURNING *;`;
  let safeValues = [firstName,lastName];
  client.query(SQL,safeValues)
    .then(result=>{
      res.send(result.rows);
    })
    .catch(error=>{
      res.send(error);
    });
}

//localhost:3010/people
function getDataHandler(req,res){
  let countryName = req.query.search_query;

  let SQL = `SELECT * FROM locations where search_query = ${countryName};`;
 
  client.query(SQL)
    .then(result=>{
      res.send(result.rows);
    })
    .catch(error=>{
      res.send(error);
    });
}

client.connect()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`listening on ${PORT}`)
    );

  });
