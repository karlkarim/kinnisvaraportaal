const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());

const regions = require("./regions.json");

app.get("/api/regions", (req, res) => {
  res.json(regions);
});

app.get("/api/regions/:name", (req, res) => {
  const region = regions.find(r => r.name.toLowerCase() === req.params.name.toLowerCase());
  if (region) res.json(region);
  else res.status(404).json({ error: "Piirkonda ei leitud" });
});

app.listen(port, () => {
  console.log(`API töötab http://localhost:${port}`);
});
