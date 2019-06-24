require("dotenv").config();

//Add the code required to import the keys.js file and store it in a variable.
const keys = require("./keys.js");
const axios = require("axios");
const moment = require("moment");
const Spotify = require('node-spotify-api');
const fs = require("fs");

const spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret,
});

var  defaultMovie = 'Mr. Nobody';


var  action = process.argv[2];
var  value = process.argv[3];

switch(action) {
  case 'concert-this':
    getBands(value);
    break;

  case 'spotify-this-song':
    getSongs(value);
    break;

  case 'movie-this':
    if (value === '') {
      value = defaultMovie;
    }
    getMovies(value);
    break;

  case 'do-what-it-says':
    doWhatItSays(value);
    break;
   default:
     break;
}

function getBands(artist) {
  axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
  .then(function(response) {
    console.log(`* Name of the venue: ${response.data[0].venue.name}`);
    console.log(`* Venue location: ${response.data[0].venue.city}`);
    console.log(`* Date of the event: ${moment(response.data[0].datetime).format('MM/DD/YYYY')}`);
  })
  .catch(function(err) {
    console.log(err);
  });
}


function getSongs(songName) {
  if (songName === '') {
    songName = 'I Saw the Sign';
  }
  spotify.search({ type: 'track', query: songName}, function(err, data) {
    if (err) {
      console.log('Error occured ' + err);
    }

    // Artists
    console.log(`Artists:  ${data.tracks.items[0].album.artists[0].name}`);

    // A preview link of the song from the spotify
    console.log(`Preview Link ${data.tracks.items[0].preview_url}`);

    // The album that the song is from 
    console.log(`Album Name ${data.tracks.items[0].album.name}`);
  });
}

function getMovies(movieName) {
  axios.get(`http://www.omdbapi.com/?apikey=42518777&t=${movieName}`)
  .then(function(response) {
    console.log(`* Title of the Movie: ${response.data.Title}`);
    console.log(`* Year the movie came out: ${response.data.Year}`);
    console.log(`* IMDB Rating of the movie: ${response.data.Rated}`);
    // console.log(`* Rotten Tomatoes Rating of the movie: ${response.data.Ratings[1].Value}`);
    console.log(`* Country where the movie was produced: ${response.data.Country}`);
    console.log(`* Language of the movie: ${response.data.Language}`);
    console.log(`* Plot of the movie: ${response.data.Plot}`);
  })
  .catch(function(err) {
    console.log(err);
  })

  // If the user does not type in a movie title 
  if (movieName === 'Mr. Nobody') {
    console.log('---------------------------------');
    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix!");
  }
}


function doWhatItSays() {
  fs.readFile('random.txt', 'utf8', function(err, data) {
    data = data.split(', ');
    let action = data[0];
    let value = data[1];

    // Get songs value
    switch(action) {
      case 'concert-this':
        getBands(value);
        break;

      case 'spotify-this-song':
        getSongs(value);
        break;

      case 'movie-this':
        getMovies(value);
        break;
      
      default:
        break;
    }
  });
}

   