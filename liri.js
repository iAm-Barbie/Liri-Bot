// pull in required modules
require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var colors = require("colors");

//
// pull in user input
var action = process.argv[2].toUpperCase();
var info = process.argv.slice(3).join(" ");

//
// decide which function will be run based on user input
function liriDo(action, info) {
  switch (action) {
    case "MOVIE-THIS":
      if (!info) {
        getMovie("Mr. Nobody");
      } else {
        getMovie(info);
      }
      break;

    case "CONCERT-THIS":
      if (!info) {
        getConcert("Ariana Grande");
      } else {
        getConcert(info);
      }
      break;

    case "SPOTIFY-THIS-SONG":
      if (!info) {
        getSong("The Sign");
      } else {
        getSong(info);
      }
      break;

    case "DO-WHAT-IT-SAYS":
      getWhatever();
      break;

    default:
      console.log("Mistakes were made.  Try again.".red);
  }
}

//
//function for movie-this
function getMovie(info) {
  axios
    .get(
        `http://www.omdbapi.com/?i=tt3896198&apikey=d2146b1c${process.env.OMDB_ID}&t=${info}`
    )
    .then(function(response) {
      console.log(
        `\n\n      ----- MOVIE INFORMATION -----\n
      Movie: ${response.data.Title}\n
      Released: ${response.data.Year}\n
      Country: ${response.data.Country}\n
      Language: ${response.data.Language}\n
      Actors: ${response.data.Actors}\n
      ${response.data.Ratings[0].Source} Rating: ${response.data.Ratings[0].Value}\n
      ${response.data.Ratings[1].Source} Rating: ${response.data.Ratings[1].Value}\n
      Plot: ${response.data.Plot}\n
      -----------------------------\n`.green
      );
    })
    .catch(function(err) {
      console.log(err);
    });
}

//
//function for concert-this
function getConcert(info) {
  axios
    .get(
      `https://rest.bandsintown.com/artists/${info}/events?app_id=${process.env.BAND_ID}`
    )
    .then(function(response) {
      console.log(
        `\n\n      ----- CONCERT INFORMATION -----\n
      Artist: ${info}\n  
      Venue: ${response.data[0].venue.name}\n
      Location: ${response.data[0].venue.city}, ${response.data[0].venue.region}\n`
          .magenta
      );
      console.log(
        "      Performance Date: ".magenta +
          moment(response.data[0].datetime).format("MM/DD/YYYY").magenta +
          " at ".magenta +
          moment(response.data[0].datetime).format("hh:mma").magenta
      );
      console.log(`\n      -----------------------------\n`.magenta);
    })
    .catch(function(err) {
      console.log(err);
    });
}

//
//function for do-what-it-says
function getWhatever() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    data = data.split(",");
    action = data[0].toUpperCase();
    info = data[1];
    info = info.replace('"', "");
    info = info.replace('"', "");
    liriDo(action, info);
  });
}

//
//function for spotify-this-song
function getSong(info) {
  //console.log(action, info);
  var spotify = new Spotify(keys.spotify);
  spotify
    .search({ type: "track", query: info })
    .then(function(response) {
      console.log(
        `
      Song: ${response.tracks.items[0].name}
      Artist: ${response.tracks.items[0].artists[0].name}
      Album: ${response.tracks.items[0].album.name}
      Preview: ${response.tracks.items[0].preview_url}`.cyan
      );
    })
    .catch(function(err) {
      console.log(err);
    });
}

//
//run the function to decide what is needed
liriDo(action, info);