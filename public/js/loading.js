const LOAD_GIF_PATH = 'img/loading.gif';
const ATTENTION_IMG_PATH = 'img/attention_icon.png';

function CardUpdater(){
  this.get_cards = function() {
    return document.getElementsByClassName('weather__card');
  }

  this.set_loading_regular_card = function(card) {
    // del header text, set load pic
    card.children[0].children[1].children[1].textContent = "";
    card.children[0].children[1].children[0].src = LOAD_GIF_PATH;
    // del param values, set load pic
    fields = card.getElementsByTagName('li');
    for (j=0; j<fields.length; j++){
      fields[j].children[1].textContent = "";
      fields[j].children[2].style.display = "block";
    }
  }
  this.set_loading_main_card = function(card) {
    // del param values, set load pic
    fields = card.getElementsByTagName('li');
    for (j=0; j<fields.length; j++){
      fields[j].children[1].textContent = "";
      fields[j].children[2].src = LOAD_GIF_PATH;
      fields[j].children[2].style.display = "block";
    }
  }
  this.set_loading_main_temperature = function(card) {
    card.getElementsByTagName('span')[0].textContent = "";
    card.getElementsByTagName('img')[0].src = LOAD_GIF_PATH;
  }

  this.set_attention_regular_card = function(card) {
    // del header text, set load pic
    card.children[0].children[1].children[1].textContent = "";
    card.children[0].children[1].children[0].src = ATTENTION_IMG_PATH;
    // del param values, set load pic
    fields = card.getElementsByTagName('li');
    for (j=0; j<fields.length; j++){
      fields[j].children[1].textContent = "";
      fields[j].children[2].style.display = "block";
    }
  }
  this.set_attention_main_card = function(card) {
    // del param values, set load pic
    fields = card.getElementsByTagName('li');
    for (j=0; j<fields.length; j++){
      fields[j].children[1].textContent = "";
      fields[j].children[2].src = ATTENTION_IMG_PATH;
      fields[j].children[2].style.display = "block";
    }
  }
  this.set_attention_main_temperature = function(card) {
    card.getElementsByTagName('span')[0].textContent = "";
    card.getElementsByTagName('img')[0].src = ATTENTION_IMG_PATH;
  }

  this.set_weather_regular_card = function(card, weather) {
    // add header text, unset load pic
    card.getElementsByTagName('h3')[0].textContent = weather['city'];
    card.children[0].children[1].children[1].textContent = weather["temp"] + "°C";
    card.children[0].children[1].children[0].src = weather['icon'];
    // del param values, set load pic
    fields = card.getElementsByTagName('li');
    for (j=0; j<fields.length; j++){
      fields[j].children[2].style.display = "none";
    }
    fields[0].children[1].textContent = weather["wind_speed"] + "м/c, напр.: " + weather['wind_deg'] + "°";
    fields[1].children[1].textContent = weather["clouds"] + "%";
    fields[2].children[1].textContent = weather["pressure"] + "мм";
    fields[3].children[1].textContent = weather["humidity"] + "%";
    fields[4].children[1].textContent = "(" + weather["lat"] + ", " + weather["lon"] + ")";
  }
  this.set_weather_main_card = function(card, weather) {
    // del param values, set load pic
    fields = card.getElementsByTagName('li');
    for (j=0; j<fields.length; j++){
      fields[j].children[2].style.display = "none";
    }
    fields[0].children[1].textContent = weather["wind_speed"] + "м/c, напр.: " + weather['wind_deg'] + "°";
    fields[1].children[1].textContent = weather["clouds"] + "%";
    fields[2].children[1].textContent = weather["pressure"] + "мм";
    fields[3].children[1].textContent = weather["humidity"] + "%";
    fields[4].children[1].textContent = "(" + weather["lat"] + ", " + weather["lon"] + ")";
  }
  this.set_weather_main_temperature = function(card, weather) {
    // set pic, add temp
    console.log(card, weather);
    card.getElementsByTagName('h3')[0].textContent = weather['city'];
    card.getElementsByTagName('span')[0].textContent = weather["temp"] + "°C";
    card.getElementsByTagName('img')[0].src = weather['icon'];
  }
}


function CardsManager() {
  this.add_card = function(city_name) {
    // Warning! It doesnt update card data
    // check if it already exists
    mngr = new CardsManager();
    let cities = mngr.get_cities();
    for (let i=0; i<cities.length; i++){
      if (cities[i].toLowerCase() == city_name){
        alert("Такой город уже добавлен");
        return;
      }
    }
    // Add new city
    card_src = mngr.create_card(city_name);
    container = document.getElementsByClassName('weather__list_cards')[0];
    container.innerHTML += card_src;

    return true;
  }

  this.get_cities = function() {
    cards = document.getElementsByClassName('card__header');
    cities = [];
    for (i=0; i<cards.length; i++){
      city = cards[i].getElementsByTagName('h3')[0].textContent;
      cities.push(city);
    }
    return cities;
  }

  this.create_card = function(city_name) {
    src = '<li class="weather__card">' +
          '      <div class="card__header flex_between">' +
          '        <h3>'+city_name+'</h3>' +
          '        <div class="card__weather_temp">' +
          '          <img src="img/weather_card_icon.png"/>' +
          '          <text>temp</text>' +
          '        </div>' +
          '        <div class="button_delete"><div>x</div></div>' +
          '      </div>' +
          '      <div class="card__body">' +
          '        <ul class="card__params">'
    params = ['Ветер', 'Облачность', 'Давление', 'Влажность', 'Координаты'];
    for (i=0; i<5; i++){
      src = src + '          <li>' +
                  '            <span><b>'+params[i]+'</b></span>' +
                  '            <span></span>' +
                  '            <img class="img__loading" src="img/loading.gif"/>' +
                  '          </li>'
    }
    src = src + '        </ul>' +
                '      </div>' +
                '    </li>';
    return src;
  }
}


function update_weather() {
  setTimeout(function(){
  updater = new CardUpdater();
  w_api = new WeatherAPI();
  cards = updater.get_cards();

  updater.set_loading_main_temperature(cards[0]);
  updater.set_loading_main_card(cards[1]);
  for (i=2; i<cards.length; i++){
    let card = cards[i];
    updater.set_loading_regular_card(card);
    let city = card.getElementsByTagName('h3')[0].textContent;
    w_api.get_by_city(city, function(weather){
      updater.set_weather_regular_card(card, weather);
    }, function(){

      updater.set_attention_regular_card(card);
    });
  }

  console.log(cards[0]);
  let city = cards[0].getElementsByTagName('h3')[0].textContent;
  w_api.get_by_city(city, function(weather){
    updater.set_weather_main_temperature(cards[0], weather);
  }, function(){
    updater.set_attention_main_temperature(card);
  });

  w_api.get_by_city(city, function(weather){
    updater.set_weather_main_card(cards[1], weather);
  }, function(){
    updater.set_attention_main_card(card);
  });
}, 400);
}
