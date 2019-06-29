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


// If the user did not specify the movie title
var  defaultMovie = 'Mr. Nobody';

let argvArr = process.argv;
var  action = process.argv[2];
var  value = process.argv[3]; 


// If the movie title is composed from more than one word
for (let i = 3; i < argvArr.length; i++) {
  if (argvArr.length > 3) {
    value = argvArr.slice(3).join(" ");
    console.log(value)
  } else {
    value = value;
  }
}

switch(action) {
  case 'concert-this':
    getBands(value);
    break;

  case 'spotify-this-song':
    getSongs(value);
    break;

  case 'movie-this':
    if (value === undefined) {
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


// GET BANDS FUNCTION
function getBands(artist) {
  axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
  .then(function(response) {
    console.log('================ Concert Info ===============');
    console.log(`* Name of the venue: ${response.data[0].venue.name}`);
    console.log(`* Venue location: ${response.data[0].venue.city}`);
    console.log(`* Date of the event: ${moment(response.data[0].datetime).format('MM/DD/YYYY')}`);
    console.log('=============================================');
  })
  .catch(function(err) {
    console.log(err);
  });
}

// GET SONGS FUNCTION
function getSongs(songName) {
  if (songName === undefined) {
    songName = 'The Sign';
  }
    spotify
  .search({ type: 'track', query: songName })
  .then(function(data) {
    console.log('=============== Song\'s Info ================');
     // Artists
    console.log(`* Artist(s):  ${data.tracks.items[0].album.artists[0].name}`);
    console.log(`* The song\'s name: ${data.tracks.items[0].name}`);
    // A preview link of the song from the spotify
    console.log(`* A preview link of the song: ${data.tracks.items[0].preview_url}`);

    // The album that the song is from 
    console.log(`* Album Name: ${data.tracks.items[0].album.name}`);
    console.log('==========================================');
  })
  .catch(function(err) {
    console.log(err);
  });
  }



// SETUP  MOVIES FUNCTION
function getMovies(movieName) {
  const query = `http://www.omdbapi.com/?apikey=42518777&t=${movieName}`
  axios.get(query)
  .then(function(response) {
    console.log('====================== MOVIE INFO =========================')
    console.log(`* Title of the Movie: ${response.data.Title}`);
    console.log(`* Year the movie came out: ${response.data.Year}`);
    console.log(`* IMDB Rating of the movie: ${response.data.Rated}`);
    if(!response.data.Ratings[0].Value){
      console.log(` Rotten Tomatoes Rating of the movie: ${response.data.Ratings[1].Value}`)
    } else {
      console.log(`* Rotten Tomatoes Rating of the movie: ${response.data.Ratings[0].Value}`)
    }
    console.log(`* Country where the movie was produced: ${response.data.Country}`);
    console.log(`* Language of the movie: ${response.data.Language}`);
    console.log(`* Plot of the movie: ${response.data.Plot}`);
    console.log(`* Actors in the movie: ${response.data.Actors}`)
    console.log('============================================================')
  })
  .catch(function(err) {
    console.log(err);
  })

  // Display the default movie title Mr. Nobody
  if (movieName == 'Mr. Nobody') {
    console.log('---------------------------------');
    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix!");
  }
}

// setup do-what-it-says function
function doWhatItSays() {
  fs.readFile('random.txt', 'utf8', function(err, data) {
    if (function(err) {
      console.log(err);
    });

    data = data.split(',');
    let action = data[0];
    let value = data[1];

    console.log(data[0], data[1]);
    
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




   