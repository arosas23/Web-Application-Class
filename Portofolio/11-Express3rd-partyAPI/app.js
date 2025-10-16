const express = require("express");
const https = require("https"); //para hacer llamadas a APIs por https
const bodyParser = require("body-parser"); //lee los datos de formulario
const path = require("path");
//require("dotenv").config(); //carga variables desde .env

const app = express();
//const API_KEY = process.env.OPENWEATHER_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); //lee los datos del formulario con post

// ruta get = index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", (req, res) => {
  const city = req.body.cityName;
  const apiKey = "a9d639f98e9b88f03cc286fb5a5cee3c"; // key
  const units = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  // Llamada de API con https
  https.get(url, (response) => {
    console.log("Status code:", response.statusCode);

    if (response.statusCode === 200) {
      response.on("data", (data) => {
        const weatherData = JSON.parse(data);

        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const cityNameReturned = weatherData.name;
        const country = weatherData.sys.country;

        // URL del ícono
        const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        res.setHeader("Content-Type", "text/html; charset=utf-8");

        // Resultado
        res.write(`<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <title>Weather Result</title>
              <link rel="stylesheet" href="style.css">
          </head>
          <body>
              <h1>Weather in ${cityNameReturned}, ${country}</h1>
              <h2>Temperature: ${temp} °C</h2>
              <p>Description: ${description}</p>
              <img src="${imageURL}" alt="Weather icon">
              <br><a href="/">Back to Home</a>
          </body>
          </html>`);
        res.send();
      });
    } else {
      res.send(`<h1>Error ${response.statusCode}: City not found or API issue.</h1><a href="/">Try again</a>`);
    }
  }).on("error", (e) => {
    res.send(`<h1>API Error: ${e.message}</h1><a href="/">Try again</a>`);
  });
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});

