const express = require("express");
const geojson = require("geojson");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const dbname = "db.sqlite";

app.set("port", process.env.PORT || 3000);
app.use("/", express.static(path.join(__dirname, "dist")));
app.use(express.json());
app.get("/api/", (req, res) => res.json({ message: "Ok" }));

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

app.get("/api/coords/", (req, res) => {
  let sql = "SELECT * from map";
  let params = [];

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: geojson.parse(rows, { Point: ["lat", "lng"] }),
    });
  });
});

app.post("/api/coords/", (req, res) => {
  let sql = "INSERT INTO map (session, timestamp, lat, lng) VALUES (?,?,?,?)";
  let data = {
    session: req.body.session,
    timestamp: req.body.timestamp,
    lat: req.body.coords[1],
    lng: req.body.coords[0],
  };
  let params = [data.session, data.timestamp, data.lat, data.lng];

  db.run(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
    });
  });
});

app.listen(app.get("port"), () =>
  console.log(`App listening at http://localhost:${app.get("port")}`)
);
