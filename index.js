const express = require("express");
const DataStore = require("nedb");
const fetch = require("node-fetch");

const app = express();
app.listen(3000, () => console.log("listening on port 3000"));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new DataStore("database.db");
database.loadDatabase();

app.post("/api", (req, res) => {
  const data = req.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  res.send({
    status: "success",
    latitude: req.body.lat,
    longitude: req.body.lon,
    time: data.timestamp
  });
  database.insert(req.body);
});

app.get("/api", (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }
    res.json(data);
  });
});

app.get("/weather/:latlon", async (req, res) => {
  const latlon = req.params.latlon.split(",");

  const lat = latlon[0];
  const lon = latlon[1];

  const weather_url = `https://api.darksky.net/forecast/af80cb9580517a10a93ed78fb3db245c/${lat},${lon}`;

  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;

  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();
  const aq_response = await fetch(aq_url);
  const aq_data = await aq_response.json();

  const data = {
    weather: weather_data,
    air_quality: aq_data
  };

  res.json(data);
});
