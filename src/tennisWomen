const bodyParser = require("body-parser");

const BASE_API = "/api/v1";

//API Antonio Saborido

const _ = require('lodash');
const axios = require('axios').default;
/*
*/
//

module.exports.register = (app) => {
  const options = {
    method: 'GET',
    url: 'https://sportscore1.p.rapidapi.com/tennis-rankings/wta',
    params: {page: '1'},
    headers: {
      'X-RapidAPI-Host': 'sportscore1.p.rapidapi.com',
      'X-RapidAPI-Key': '437bff414bmsh9f6e0dd49e648d5p1b29bejsn0776a44f8da0'
    }
  };



  axios.request(options).then(function (response) {
    tennisplayers2 = response.data.data;
  }).catch(function (error) {
    console.error(error);
  });

  app.get(BASE_API + "/tennisWomen", (req, res) => {
    res.send(JSON.stringify(tennisplayers2));
  });
}