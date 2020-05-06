/*************************************************************
 * 
 * MILESTONE 1
 * 
 * clicking the button, search the API for all the films that contain 
what the  user wrote.
 * After the API response, we want to display the following values on 
the screen for each film found:
 * -Title,
 * -Original title,
 * -Original language,
 * -Rating.
 * 
 ***********************************************************/

/****************************************************************
 * 
 * MILESTONE 2
 * 
 * We transform the score from 1 to 10 decimal in an integer from 1 to 5, so as to allow us to print on the screen a number of full stars ranging from 1 to 5.
 * We then transform the static string of the language into a real flag of the corresponding nation, managing the case in which we do not have the nation flag returned by the API.
 * We then broaden the search to include TV series.
 ***************************************************************/

$(document).ready(function() {

    // referece
    var btnSearch = $('.btn-search');
    var inputSearch = $('.Input');
    
    // Init Handlenars
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);

    // search with button and enter 
    btnSearch.click(function(){
        var query = inputSearch.val().trim();
        searchMovies(template, query, inputSearch);
    });
    inputSearch.keypress(function(e) {
        if(e.which == 13) {
            var query = inputSearch.val().trim();
            searchMovies(template, query, inputSearch);
        }
    });

}); // end document ready

/**********************************************
    FUNCTIONS
 **********************************************/

// search movie function
function searchMovies(template, query, inputSearch) {
    // reference
    var movies = $('.movies');
    reset(movies); 
    // reference API
    var typeMovie = 'Movie';
    var typeTv = 'TV Series';
    var objMovie = {
        query : query,
        myApi : 'https://api.themoviedb.org/3/search/movie',
        apiKey : '3fd3d81771a2efd18bf7d6e160d4ad81',
        language : 'it-IT',
    }
    var objTv = {
        query : query,
        myApi : 'https://api.themoviedb.org/3/search/tv',
        apiKey : '3fd3d81771a2efd18bf7d6e160d4ad81',
        language : 'it-IT',
    }
    if ( query !== '' ) {
        // call API movie
        callApi(objMovie, template, movies, typeMovie);
        callApi(objTv, template, movies, typeTv);
    } else {
        alert('Inserisci un titolo valido');
        inputSearch.focus();
    }
}

// API function
function callApi(obj, template, movies, type){
    $.ajax({
        url : obj.myApi, 
        method : 'GET',
        data: {
            api_key : obj.apiKey,
            language : obj.language,
            query: obj.query
        },
        success: function(res) {
            // var type = 'Movie';
            var movieInfo = res.results;
            if ( movieInfo.length > 0 ) {
                printMovie(movieInfo, template, movies, type);
            } else {
                console.log('Prego, inserisci un titolo valido');
            }
        },
        error: function(){
            console.log('ERROR API');
        } 
    });
}

// print movie details function
function printMovie(movieInfo, template, movies, type) {
    for (var i = 0; i < movieInfo.length; i++) {
        var movie = movieInfo[i];
        var title, originalTitle, overview;

        if( type == 'Movie' ) {
            title = movie.title;
            originalTitle = movie.original_title;
            overview = movie.overview;
        } else if ( type == 'TV Series' ) {
            title = movie.name;
            originalTitle = movie.orinal_name;
            overview = movie.overview;
        }
        var movieObj = { 
            title : title,
            original_title : originalTitle,
            original_language : flag(movie),
            rating : ratingStar(movie),
            type : type,
            overview : overview
        }
    // add template
    var html = template(movieObj);
    movies.append(html);
    }
}

// reset container function
function reset(element) {
    element.html('');
}

// transfor raiting in a star function
function ratingStar(movie) {
    var ratingFloor = Math.floor(movie.vote_average / 2);
    var star = '';
    // }
    for ( var i = 1; i <= 5; i++) {
        if( i <= ratingFloor ) {
            star += '<i class="fas fa-star"></i>';
        } else {
            star += '<i class="far fa-star"></i>';
        } 
    }
    return star;
}

// transform language It or En in a flag function
function flag(movie) {
    var language = movie.original_language;
    switch (language) {
        case 'en':
            return '<img class="flag" src="img/en.svg">'
        case 'it':
            return '<img class="flag" src="img/it.svg">'
        default: 
            return language;
    }
}

