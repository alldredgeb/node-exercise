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
  var peoplePageUrl = 'https://swapi.co/api/people';
  var peopleData = [];
  function swapiPeople() {
    axios.get(peoplePageUrl).then(response => {
      for(let i = 0 ; i < response.data.results.length ; i++) {
        peopleData.push(response.data.results[i])
      }
      if (response.data.next) {
        peoplePageUrl = response.data.next
        swapiPeople();
      }
      else {
        if (req.query.sortBy === 'name') {
          console.log('name sort')
          peopleData.sort((a,b) => (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0));
          res.status(200).send(peopleData)
        }
        else if (req.query.sortBy === 'height') {
          console.log('height sort')
          peopleData.sort((a,b) => a.height - b.height);
          res.status(200).send(peopleData)
        }
        else if (req.query.sortBy === 'mass') {
          console.log('mass sort')
          peopleData.sort((a,b) => a.mass - b.mass);
          res.status(200).send(peopleData)
        }
        else {
          res.status(200).send(peopleData)
        }
      }
    }).catch( error => {
      res.status(404).send(error);
    })
  }
  swapiPeople();
})

app.get('/api/planets', (req, res) => {
  var planetsPageUrl = 'https://swapi.co/api/planets';
  var planetsData = [];
  function swapiPlanets() {
    axios.get(planetsPageUrl).then(response => {
      for(let j = 0 ; j < response.data.results.length ; j++) {
        planetsData.push(response.data.results[j])
      }
      if (response.data.next) {
        planetsPageUrl = response.data.next
        swapiPlanets();
      }
      else {
        planetsDataIndex = 0;
        planetResidentUrl = '';
        function insertResidentNames() {
          
          if(planetsDataIndex < planetsData.length - 1) {
            planetsIndex++
            insertResidentNames();
          }
          else {
            res.status(200).send(planetsData)
          }
        }
        insertResidentNames();
      }
    }).catch( error => {
      res.status(404).send(error);
    })
  }
  swapiPlanets();
})

//LISTEN
app.listen(port, () => console.log(`listening on port ${port}!`));