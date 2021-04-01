var base_url = window.location.href + 'favourites';

function _request(url, type, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.addEventListener("load", function (event) {
        if (xhr.status !== 200) {
            const errorJson = JSON.parse(xhr.responseText);
            console.log(errorJson);
            alert(errorJson['msg']);
        } else {
            const jsonResponse = JSON.parse(xhr.responseText);
            callback(jsonResponse);
        }
    }, false);
    xhr.addEventListener("error", function (event) {
        alert("Произошла ошибка! Проверьте доступ к сети");
    }, false)
    xhr.send();
}

function Storage(city_name) {
  this.get_cities = function(cb) {
    // Returns all cities names from localStorage

    _request(base_url, "GET", (cities) => {
      console.log('cities', cities);
      cb(cities);
    })
  }

  this.add_city = function(city_name) {
    _request(base_url + "?city="+city_name.toLowerCase(), "POST", (status) => {
      console.log('add city?', status);
    })
  }

  this.remove_city = function(city_name) {
    _request(base_url + "?city="+city_name.toLowerCase(), "DELETE", (status) => {
      console.log('del city?', status);
    })
  }

  this.is_stored = function(city_name) {
    // _request(base_url, "GET", (cities) => {
    //   for
    // })
    return false
  }
}
