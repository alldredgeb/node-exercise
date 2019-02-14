//IMPORTS / REQUIRES
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

//VARIABLES
const app = express();
const port = 3100;

//TOP LEVEL MIDDLEWARE
app.use(bodyParser.json());

//ENDPOINTS
app.get('/api/people', (req, res) => {
  var page = 1;
  var peopleData = [];
  function swapiPeople() {
    axios.get(`https://swapi.co/api/people/?page=${page}`).then(response => {
      for(let i = 0 ; i < response.data.results.length ; i++) {
        peopleData.push(response.data.results[i])
      }
      if (page < 9) {
        page++
        swapiPeople();
      }
      else {
        res.status(200).send(peopleData)
      }
    }).catch( error => {
      res.status(404).send(error);
    })
  }
  swapiPeople();
})

app.get('/api/planets', (req, res) => {
  axios.get('https://swapi.co/api/planets').then(response => {
    res.status(200).send(response)
  }).catch( error => {
    res.status(500).send(error);
  })
})

//LISTEN
app.listen(port, () => console.log(`listening on port ${port}!`));