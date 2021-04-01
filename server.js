const http_statuses = require('http-status-codes');
const express = require('express');
const app = express();

const db = require('./server/db.js');
const geo = require('./server/geo.js');
const w_api = new geo.WeatherAPI();


app.get('/weather/city', (req, res) => {
    let city_name = req.query.q;

    w_api.get_by_city(city_name, function(weather){
      res.send(weather);
    }, function (err_json) {
      res.status(404).send(err_json)
    })
});


app.get('/weather/coordinates', (req, res) => {
    w_api.get_by_coords(req.query.lat, req.query.lon, function(weather){
      res.send(weather);
    }, function (err_json) {
      res.status(404).send(err_json)
    })
});


app.get('/favourites', (req, res) => {
  let sql = "SELECT city FROM favourites";
  db.get((rows) => {
    res.json(rows);
  }, (err) => {
    res.status(400).json({"error": err.message});
    return;
  })
})

app.post('/favourites', (req, res) => {
  w_api.get_by_city(req.query.city, function(weather){
    db.insert(req.query.city, (err) => {
      if (err) {
        res.status(400).json({"error": err.message});
        return;
      }
      res.json({
          "message":"success",
      })
    });
  },
    function(err){}
    // function (err_json) {
    //   res.status(400).json({'error': 'no such city'});
    //   return;
    // }
  )
})


app.delete('/favourites', (req, res) => {
  console.log(req.query.city);
  db.remove(req.query.city, (err) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
        "message":"success",
    })
  });
})

app.use(express.static('public'));

app.listen(3000, () => console.log('Gator app listening on port 3000!'));
