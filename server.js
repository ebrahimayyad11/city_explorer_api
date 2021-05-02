'use strict';
const express=require('express');
require ('dotenv').config();
const cors =require('cors');
const superagent=require('superagent');
// const postgres=require('pg');


const server=express();
const PORT = process.env.PORT || 3500;
server.use(cors());
// let client;
// let DATABASE_URL = process.env.DATABASE_URL;
// let ENV =  process.env.ENV ||'';
// if (ENV === 'DEV') {
//   client = new postgres.Client({
//     connectionString: DATABASE_URL
//   });
// } else {
//   client = new postgres.Client({
//     connectionString: DATABASE_URL,
//     ssl: {}
//   });
// }


// let Location = function (obj,name) {
//     this.search_query = name;
//     this.formatted_query = obj.display_name;
//     this.latitude = obj.lat;
//     this.longitude = obj.lon;
//   };
  
  
//   server.get('/location', (req, res) => {
//     let key = process.env.GEOCODE_API_KEY;
//     let countryName = req.query.city;
//     let locationData = [countryName];
//     let locationQuery = `SELECT * from locations where search_query=$1;`;
//     let locationURL = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${countryName}&format=json`;
//     client.query(locationQuery,locationData)
//       .then(result=>{
//         // console.log(result.rowCount);
//         if(result.rowCount !== 0){
//           res.send(result.rows[0]);
//         }else{
//           // console.log('catch');
//           superagent.get(locationURL)
//             .then(item=>{
//               let getData=item.body[0];
//               let newLocation = new Location(getData,countryName);
//               console.log(newLocation);
//               let queryData = [newLocation.search_query,newLocation.formatted_query,newLocation.latitude,newLocation.longitude];
//               let newQuery =`INSERT into locations (search_query,formatted_query,latitude,longitude) values ($1,$2,$3,$4);`;
//               client.query(newQuery,queryData)
//                 .then(() => {
//                   res.send(newLocation);
//                 });
//               // console.log('API',newLocation);
//             });
//         }
//       });
//   });
  
  
  
  
//   let Weather = function (description,date){
//     this.forecast = description;
//     this.time = new Date(date).toDateString();
//   };
  
  
//   server.get('/weather', (req, res) => {
//     let key = process.env.WEATHER_API_KEY;
//     let countryName = req.query.search_query;
//     let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${countryName}&key=${key}`;
//     superagent.get(weatherURL)
//       .then(item => {
//         let getData = item.body.data;
//         let result = getData.map(items => {
//           return new Weather(items.weather.description,items.datetime);
//         });
//         res.status(200).send(result);
//       })
  
//       .catch(error => {
//         res.send(error);
//       });
//   });
  
  
  
  
  
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
  

  function Movie (obj){
      this.title = obj.title;
      this.overview = obj.overview;
      this.average_votes = obj.vote_average;
      this.total_votes = obj.vote_count;
      this.image_url = obj.poster_path;
      this.popularity = obj.popularity;
      this.released_on = obj.release_date;
  }

  server.get('/movies', (req,res) => {
    let key = process.env.MOVIE_API_KEY;
    let countryName = req.query.query;
    let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${countryName}`;
    superagent.get(movieURL)
      .then(item => {
        let getData = item.body.results;
        let result = [];
        getData.forEach(items => {
          result.push(new Movie(items));
        });
        res.send(result);
      });
  });
  

  function Yelp (obj){
    this.name = obj.name;
    this.image_url = obj.image_url;
    this.price = obj.price;
    this.rating = obj.rating;
    this.url = obj.url;
  }

  server.get('/yelp', (req,res) => {
    let key = process.env.YELP_API_KEY ;
    let countryName = req.query.location;
    let pageNumber = req.query.page;
    let limit = 5;
    let offset = (pageNumber - 1) * limit + 1;
    let yelpURL = `https://api.yelp.com/v3/businesses/search?location=${countryName}&limit=${limit}&offset=${offset}`;
    superagent
    .get(yelpURL)
    .set('Authorization', `Bearer ${key}`)
      .then(item => {
        let getData = item.body.businesses;
        let result = [];
        getData.forEach(items => {
          result.push(new Yelp(items));
        });
        res.send(result);
      });
  });



server.get('/*' ,(req,res) => {
    res.send('error 404');
  });
  
  
  // client.connect()
  //   .then(()=>{
      server.listen(PORT,()=>{
        // console.log(`listening to port ${PORT}`);
      });
    // });