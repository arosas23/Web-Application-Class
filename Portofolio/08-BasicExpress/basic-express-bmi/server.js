const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/bmi", (req, res) => {
    const weightD = req.body.weight;
    const heightD = req.body.height;

    const weight = parseFloat(weightD);
    const height = parseFloat(heightD);

    if (Number.isNaN(weight) || Number.isNaN(height) || height <= 0 || weight <= 0) {
        return res.send("Invalid input. Please enter positive numbers for weight and height.");
    }

    const bmi = (weight / (height * height)) * 10000;
    const bmiRounded = Math.round(bmi * 100) / 100;

    res.send(`Your BMI is ${bmiRounded}`);
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});