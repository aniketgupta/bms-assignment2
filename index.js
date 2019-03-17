const app = document.getElementById('root');
const posterContainer = document.createElement('div');
posterContainer.setAttribute('class', 'poster-container');

app.appendChild(posterContainer);

/**
 * Shows the trailer of movie
 * @author Aniket Gupta
 * @param {String} params The movie trailer data
 */
function showTrailer(params) {
  document.getElementById('movie-trailer').classList.add("show");
  var paramsData = params.split(',');
  //0 posterData.TrailerURL, 
  //1 posterData.EventName, 
  //2 posterData.EventLanguage, 
  //3 posterData.EventGenre, 
  //4 posterData.DispReleaseDate,
  //5 DispReleaseYear
  //6 posterData.wtsPerc,
  //7 posterData.wtsCount,
  //8 posterData.maybeCount,
  //9 posterData.dwtsCount,
  //10 posterData.EventImageCode
  paramsData[0] = paramsData[0].replace("watch?v=", "embed/");

  if (paramsData[0].includes('&feature=youtu.be')) {
    paramsData[0] = paramsData[0].replace("&feature=youtu.be", "?autoplay=1");
    document.getElementById('single-trailer').src = paramsData[0];  
  } else {
    document.getElementById('single-trailer').src = paramsData[0] + '?autoplay=1';
  }

  document.getElementById('movie-name').innerHTML = paramsData[1];
  document.getElementById('movie-lang').innerHTML = paramsData[2];
  var genres = paramsData[3].split('|');
  document.getElementById('genre-tag1').classList.add("genre-tag");
  document.getElementById('genre-tag1').innerHTML = genres[0];

  if (genres[1]) {
    document.getElementById('genre-tag2').classList.add("genre-tag");
    document.getElementById('genre-tag2').innerHTML = genres[1]; 
  } 

  if(genres[2]) {
    document.getElementById('genre-tag3').classList.add("genre-tag");
    document.getElementById('genre-tag3').innerHTML = genres[2];
  }

  document.getElementById('likes').innerHTML = paramsData[6] + '%';
  document.getElementById('votes').innerHTML = paramsData[7] + ' votes';
  document.getElementById('release-date').innerHTML = moment(paramsData[4], "MMMM D YYYY").format("D MMM");
  document.getElementById('release-year').innerHTML = paramsData[5];
}

/**
 * Closes the movie trailer
 * @author Aniket Gupta
 */
function closeTrailer() {
  document.getElementById('movie-trailer').classList.remove("show");
  document.getElementById('single-trailer').src = '';
}

/**
 * Generates cards for each movie poster
 * @author Aniket Gupta
 * @param {Object} posterData The movie poster data
 */
function generateCards(posterData) {
  const poster = document.createElement('div');
  poster.setAttribute('class', 'movie-poster');
  const posterImg = document.createElement('img');
  posterImg.setAttribute('class', 'poster-img');
  var params = [];
  params.push(
    posterData.TrailerURL, 
    posterData.EventName, 
    posterData.EventLanguage, 
    posterData.EventGenre, 
    posterData.DispReleaseDate,
    posterData.wtsPerc,
    posterData.wtsCount,
    posterData.maybeCount,
    posterData.dwtsCount,
    posterData.EventImageCode
  );
  posterImg.setAttribute('onClick', 'showTrailer("'+ params +'")');
  // One of the poster is missing
  if (posterData.EventImageCode == "sheene-et00044696-17-04-2017-17-59-42") {
    posterImg.setAttribute('src', 'https://in.bmscdn.com/events/moviecard/gul-maka-et00079053-03-07-2018-04-52-46.jpg');
  } else {
    posterImg.setAttribute('src', 'https://in.bmscdn.com/events/moviecard/'+ posterData.EventImageCode +'.jpg');
  }

  const posterPlayBtn = document.createElement('img');
  posterPlayBtn.setAttribute('class', 'poster-play-btn');
  posterPlayBtn.setAttribute('src', './images/play_btn.png');

  const posterName = document.createElement('span');
  posterName.setAttribute('class', 'poster-name');
  posterName.textContent = posterData.EventName;

  const posterRelease = document.createElement('span');
  posterRelease.setAttribute('class', 'poster-release');
  // Adding break tag
  posterRelease.textContent = moment(posterData.DispReleaseDate, "MMMM D YYYY").format("D") +"\n"+ moment(posterData.DispReleaseDate, "MMMM D YYYY").format("MMM");
  posterRelease.innerHTML = posterRelease.innerHTML.replace(/\n\r?/g, '<br />');

  const posterLikes = document.createElement('span');
  posterLikes.setAttribute('class', 'poster-likes');
  const posterLikesImg = document.createElement('img');
  posterLikesImg.setAttribute('src', './images/like.png');
  posterLikes.textContent = posterData.wtsPerc + " %";

  const posterVotes = document.createElement('span');
  posterVotes.setAttribute('class', 'poster-votes');
  posterVotes.textContent = posterData.wtsCount;

  posterContainer.appendChild(poster);

  poster.appendChild(posterImg);
  poster.appendChild(posterPlayBtn);
  poster.appendChild(posterName);
  poster.appendChild(posterRelease);
  poster.appendChild(posterLikes);
  posterLikes.appendChild(posterLikesImg);
  poster.appendChild(posterVotes);
}

var xhr = new XMLHttpRequest();
// Adding proxy URL to avoid CORS policy error
// var proxyurl = "https://cors-anywhere.herokuapp.com/";
var proxyurl = "https://secret-ocean-49799.herokuapp.com/";

xhr.open('GET', proxyurl+'https://in.bookmyshow.com/serv/getData?cmd=GETTRAILERS&mtype=cs', true);
xhr.onload = function () {
	// Begin accessing data here
	var data = JSON.parse(this.response);
	var dataKeys = data[1];
	var movieData = Object.values(dataKeys);
	movieData.forEach(movie => {
	  generateCards(movie);
	});
}
xhr.send();