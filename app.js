const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    // Calling the API key
    const apiKey = process.env.API_KEY;
    const unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const description = weatherData.weather[0].description;
            const temp = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;
            const imgURL = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
            res.render("response", {
                city: query.toUpperCase(),
                temperature: temp,
                desc: description,
                imgURL: imgURL
            });
        });
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});