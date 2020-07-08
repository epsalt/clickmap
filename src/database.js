var sqlite3 = require("sqlite3").verbose();
const dbname = "db.sqlite";

let db = new sqlite3.Database(dbname, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    db.run(
      `CREATE TABLE map (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session text,
            timestamp integer,
            lat real,
            lng real
            )`,
      (err) => {
        if (err) {
	  console.log(err.message);
        }
      }
    );
  }
});

module.exports = db;
