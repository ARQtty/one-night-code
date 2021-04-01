const sqlite3 = require("sqlite3").verbose();
const DBSOURCE = "db.sqlite"

const db = new sqlite3.Database(DBSOURCE, (err) => {});

(function init_db(){
  console.log('initing db');
  db.prepare(`DROP TABLE IF EXISTS favourites`).run();
  db.prepare(`CREATE TABLE favourites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            city text UNIQUE
          )`).run();
})();


function insert(city, cb){
  var insert = 'INSERT INTO favourites (city) VALUES (?)';
  try{
    db.run(insert, [city]);
    cb();
  }catch{
    cb_err({'error': "cant insert"});
  }
}

function get(cb, cb_err){
  var query = 'SELECT city FROM favourites';
  db.all(query, (err, rows) => {
    if (err){
      cb_err(err);
    }
    cb(rows)
  });
}

function remove(city, cb){
  var query = 'DELETE FROM favourites WHERE city=?';
  db.run(query, city, (err) => {
    if (err){
      cb(err);
    }
    cb();
  });
}


module.exports = {insert: insert,
                  get: get,
                  remove: remove}
