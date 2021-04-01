window.onload = function() {
  function set_current_weather(weather) {
    updater.set_weather_main_temperature(cards[0], weather);
    updater.set_weather_main_card(cards[1], weather);
  }
  function set_current_weather_attention_sign(){
    updater.set_attention_main_temperature(cards[0]);
    updater.set_attention_main_card(cards[1]);
  }

  function coords_success(lat, lon){
    w_api.get_by_coords(lat, lon, set_current_weather, set_current_weather_attention_sign);
  }
  function coords_rejected(){
    default_city = "Токио";
    w_api.get_by_city(default_city, set_current_weather, set_current_weather_attention_sign);
  }


  function set_delete_listener(card) {
    let delete_button = card.getElementsByClassName("button_delete")[0];
    delete_button.addEventListener("click", function(e){
      if (e.path.length == 10){
        let city = e.path[1].getElementsByTagName('h3')[0].textContent;
        console.log('remove from storage city', city);
        storage.remove_city(city);
        e.path[2].remove();
      }else if (e.path.length == 11){
        let city = e.path[2].getElementsByTagName('h3')[0].textContent;
        console.log('remove from storage city', city);
        storage.remove_city(city);
        e.path[3].remove();
      }else{
        console.log('what?')
      }
    })
  }

  function add_city(city){
    if (cards_mngr.add_card(city)){
      w_api.get_by_city(city, function(weather){
        cards = (new CardUpdater()).get_cards();
        card = cards[cards.length-1];
        set_delete_listener(card);
        console.log('set weather', weather, 'to card', card)

        updater.set_loading_regular_card(card);
        updater.set_weather_regular_card(card, weather);
      }, function(){
        // remove broken card
        cards = (new CardUpdater()).get_cards();
        cards[cards.length-1].remove();
      });
    }
  }


  // Set current city weather
  let w_api = new WeatherAPI();
  let updater = new CardUpdater();
  let cards_mngr = new CardsManager();
  let storage = new Storage();

  let cities = storage.get_cities((cities) => {
    console.log('init citites', cities);
    for (let i=0; i<cities.length; i++){
      console.log('Create from storage', cities[i]);
      add_city(cities[i]['city']);
    }
  });

  cards = updater.get_cards();

  updater.set_loading_main_temperature(cards[0]);
  updater.set_loading_main_card(cards[1]);
  request_coords(coords_success, coords_rejected);

  // Add button listeners
  document
  .getElementsByClassName("update_all_button")[0]
  .addEventListener("click", update_weather);
  document
  .getElementsByClassName("update_all_button")[1]
  .addEventListener("click", update_weather);
  //// Add listen add city
  document
  .getElementById('add_city_button_click')
  .addEventListener("click", function() {
    let city = document.getElementById('add_city_input').value;
    storage.add_city(city);
    add_city(city);
    document.getElementById('add_city_input').value = "";
  })
  document
  .getElementById('add_city_input')
  .addEventListener("keypress", function(e){
    if (e.key === 'Enter') {
      let city = document.getElementById('add_city_input').value;
      storage.add_city(city);
      add_city(city);
      document.getElementById('add_city_input').value = "";
    }
  });
  //// Add listen delete card
  for (let i=0; i<cards.length; i++){
    cards[i].addEventListener("click", function(e){
      // console.log(e.path[2])
      set_delete_listener(e.path[2])
    })
  };



  // Load favourite cards
}
