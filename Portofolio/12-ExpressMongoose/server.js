const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

const mongoUrl = "mongodb+srv://aemirosas:Holis2025!@cluster0.zkggffh.mongodb.net/12ExpressMongoose";

mongoose.connect(mongoUrl)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Definition of a schema
const teamSchema = new mongoose.Schema({
  id: Number,
  name: String,
  nationality: String,
  url: String,
});
teamSchema.set("strictQuery", true);

const driverSchema = new mongoose.Schema({
  num: Number,
  code: String,
  forename: String,
  surname: String,
  dob: Date,
  nationality: String,
  url: String,
  team: teamSchema,
});
driverSchema.set("strictQuery", true);

const Team = mongoose.model("Team", teamSchema);
const Driver = mongoose.model("Driver", driverSchema);

app.get("/", (req, res) => {
  res.render("index");
});

// --- API routes for Driver model ---
// List all drivers
app.get("/drivers", async (req, res) => {
  try {
    const drivers = await Driver.find();

    res.json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});

// Get a single driver by id
app.get("/drivers/:id", async (req, res) => {
  try {
    const driver = await Driver.find({ "num": req.params.id });

    if (!driver) return res.status(404).json({ error: "Driver not found" });
    
    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch driver" });
  }
});

// Create a new driver
app.post("/drivers", async (req, res) => {
  try {
    const data = req.body || {};

    const driverData = {
      num: data.num,
      code: data.code,
      forename: data.forename || data.name || '',
      surname: data.surname || data.lname || '',
      dob: data.dob ? new Date(data.dob) : undefined,
      nationality: data.nationality || data.nation || '',
      url: data.url,
    };

    if (data.team) {
      driverData.team = {
        name: data.team,
        nationality: data.nationality || data.nation || '',
        url: data.url || '',
      };
    }

    const newDriver = new Driver(driverData);
    await newDriver.save();

    res.status(201).json(newDriver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create driver" });
  }
});

// Update an existing driver (partial update allowed)
app.put("/drivers/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (updates.dob) updates.dob = new Date(updates.dob);
    
    const updated = await Driver.findOneAndUpdate({ "num": Number(req.params.id) }, updates, { new: true });
    
    if (!updated) return res.status(404).json({ error: "Driver not found" });
    
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update driver" });
  }
});

// --- API routes for Team model ---
// List all teams
app.get("/teams", async (req, res) => {
  try {
    const teams = await Team.distinct("team");

    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

// Get distinct nationalities from teams
app.get("/teams/nationalities", async (req, res) => {
  try {
    const nationalities = await Team.distinct("nationality");
    
    res.json(nationalities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch nationalities" });
  }
});

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
