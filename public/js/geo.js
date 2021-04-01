function request_coords(cb_success, cb_reject) {
  navigator.geolocation.getCurrentPosition(function(coords){
    let lat = coords['coords']['latitude'];
    let lon = coords['coords']['longitude'];
    cb_success(lat, lon);
  }, cb_reject);
}

function _query(url, cb, cb_error){
  console.log("q by url", url);
  fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data['cod'] == 404){
      alert('В api нет такого города(');
      throw 1;
    }
    cb(data);
  })
  .catch(err => {
    console.log('some err. Setting attention sign');
    if (err == 'TypeError: Failed to fetch'){
      alert('Проблемы с интернетом!');
    }
    cb_error();
  })
}

function WeatherAPI() {
  var base_url = window.location.href + 'weather/';

  this.get_by_city = function(city_name, cb, cb_error){
    _query(base_url + "city?q="+city_name, cb, cb_error)
  }

  this.get_by_coords = function(lat, lon, cb, cb_error){
    _query(base_url + "coordinates?lat="+lat+"&lon="+lon, cb, cb_error)
  }
}
