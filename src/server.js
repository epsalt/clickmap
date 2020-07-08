const express = require("express");
const geojson = require("geojson");
const hri = require("human-readable-ids").hri;
const db = require("./database.js");

const app = express();
const port = 3000;

app.use(express.static("dist"));
app.use(express.json());
app.get("/api/", (req, res) => res.json({ message: "Ok" }));

app.get("/api/coords/", (req, res) => {
  var sql = "SELECT * from map";
  var params = [];

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

app.get("/api/id", (req, res) =>
  res.json({ message: "success", id: hri.random() })
);

app.post("/api/coords/", (req, res) => {
  var sql = "INSERT INTO map (session, timestamp, lat, lng) VALUES (?,?,?,?)";
  var data = {
    session: req.body.session,
    timestamp: req.body.timestamp,
    lat: req.body.coords[1],
    lng: req.body.coords[0],
  };
  var params = [data.session, data.timestamp, data.lat, data.lng];

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

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
