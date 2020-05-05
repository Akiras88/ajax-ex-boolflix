$(document).ready(function() {
    
    /*************************************************************
     * 
     * MILESTONE 1
     * 
     * clicking the button, search the API for all the films that contain what the  user wrote.
     * After the API response, we want to display the following values on the screen for each film found:
     * -Title,
     * -Original title,
     * -Original language,
     * -Rating.
     * 
     ***********************************************************/

    // referece
    var btnSearch = $('.btn-search');
    var inputSearch = $('.Input');
    
    // Init Handlenars
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);

    // search with button and enter 
    btnSearch.click(function(){
        var query = inputSearch.val().trim();
        printMovies(template, query, inputSearch);
    });
    inputSearch.keypress(function(e) {
        if(e.which == 13) {
            var query = inputSearch.val().trim();
            printMovies(template, query, inputSearch);
        }
    });

}); // end document ready

/**********************************************
    FUNCTIONS
 **********************************************/

// search function
function printMovies(template, query, inputSearch) {
    // reference
    var movies = $('.movies');
    // reference API
    var apiKey = '3fd3d81771a2efd18bf7d6e160d4ad81';
    var language = 'it-IT';
    if ( query !== '' ) {
    // call API 
        $.ajax({
            url : 'https://api.themoviedb.org/3/search/movie', 
            method : 'GET',
            data: {
                api_key : apiKey,
                language : language,
                query: query
            },
            success: function(res) {
                reset(movies);
                var movieInfo = res.results;
                if ( movieInfo.length > 0 ) {
                    printMovie(movieInfo, template, movies);
                } else {
                    alert('Prego, inserisci una parola valida');
                    inputSearch.select();
                }
            },
            error: function(){
                console.log('ERROR API');
            } 
        });
    } else {
        alert('Inserisci un titolo valido');
        inputSearch.focus();
    }
}

// print movie details function
function printMovie(movieInfo, template, movies) {
    reset(movies);
    for (var i = 0; i < movieInfo.length; i++) {
        var movie = movieInfo[i];
        var movieObj = { 
            title : movie.title,
            original_title : movie.original_title,
            original_language : flag(movie),
            rating : ratingStar(movie)
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
    var ratingCeil = Math.ceil(movie.vote_average / 2);
    var star = '';
    // for ( var i = 0; i > ratingCeil; i++) {
        // star += '<i class="fas fa-star"></i>';
    // }
    for ( var i = 0; i < ratingCeil; i++) {
        star += '<i class="fas fa-star"></i>';
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