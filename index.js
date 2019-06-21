const express = require("express");
const DataStore = require("nedb");

const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new DataStore("database.db");
database.loadDatabase();

app.post("/api", (req, res) => {
  console.log(req.body);
  res.send({
    status: "success",
    latitude: req.body.lat,
    longitude: req.body.lon
  });
  database.insert(req.body);
});

app.listen(3000, () => console.log("listening on port 3000"));
