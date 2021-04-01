module.exports = {
    WeatherAPI: WeatherAPI
}

global.fetch = require("node-fetch");


async function _query(url, cb, cb_error){
  console.log(url);
  try{

  const response = await fetch(encodeURI(url));
    if (!response.ok) {
        const serverError = JSON.parse(await response.text());
        cb_error(serverError);
    }
    const text = await response.text();
    const data = JSON.parse(text);

    let weather = {wind_speed: data['wind']['speed'],
                    wind_deg: data['wind']['deg'],
                    clouds: data['clouds']['all'],
                    pressure: data['main']['pressure'],
                    humidity: data['main']['humidity'],
                    lon: data['coord']['lon'],
                    lat: data['coord']['lat'],
                    city: data['name'],
                    icon: 'http://openweathermap.org/img/wn/'+data['weather'][0]['icon']+'@4x.png',
                    temp: Math.round(data['main']['temp'] - 272.15)};
    cb(weather);
  }catch{
    cb_error();
  }
}


function WeatherAPI() {
  this.key = "4e78cac93be94d53bf5bcab847fb390c";
  this.base_url = "https://api.openweathermap.org/data/2.5/weather";
}

WeatherAPI.prototype.get_by_city = function(city_name, cb, cb_error){
  _query(this.base_url + "?q="+city_name+"&appid="+this.key+"&lang=ru", cb, cb_error)
}

WeatherAPI.prototype.get_by_coords = function(lat, lon, cb, cb_error){
  _query(this.base_url + "?lat="+lat+"&lon="+lon+"&appid="+this.key+"&lang=ru", cb, cb_error)
}
