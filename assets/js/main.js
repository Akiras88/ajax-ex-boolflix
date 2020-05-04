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
        var query = inputSearch.val();
        printMovies(template, query);
    });
    inputSearch.keypress(function(e) {
        if(e.which == 13) {
            var query = inputSearch.val();
            printMovies(template, query);
        }
    });

}); // end document ready

/**********************************************
    FUNCTIONS
 **********************************************/

// print movies search function
function printMovies(template, query) {
    // reference
    var movies = $('.movies');
    // reference API
    var apiKey = '3fd3d81771a2efd18bf7d6e160d4ad81';
    var language = 'it-IT';
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
            movies.html('');
            var movieInfo = res.results;
            for (var i = 0; i < movieInfo.length; i++) {
                var movieObj = { 
                    title : movieInfo[i].title,
                    original_title : movieInfo[i].original_title,
                    original_language : movieInfo[i].original_language,
                    rating : movieInfo[i].vote_average
                }
                // add template
                var html = template(movieObj);
                movies.append(html);
            }
            
        },
        error: function(){
            console.log('ERROR');
        } 
    });
}