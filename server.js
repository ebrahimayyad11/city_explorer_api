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
  let SQL = `SELECT * FROM people where ${};`;
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
