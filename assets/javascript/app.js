$(document).ready(function () {
    // Hide second page on initial html loading
    $("#second-page").hide();
    // Hide last page on initial html loading
    $("#third-page").hide();
    // Preloader hide
    $(".preloader-wrapper").hide();
    // hides element for when no results are found
    $("#no-results-page").hide();
    // Initialize Firebase
    // var config = {
    //     apiKey: "AIzaSyA_VMGGZF6Q-BW970FUV9RJMBwZ16ETqbA",
    //     authDomain: "foodapp-5d5d5.firebaseapp.com",
    //     databaseURL: "https://foodapp-5d5d5.firebaseio.com",
    //     projectId: "foodapp-5d5d5",
    //     storageBucket: "",
    //     messagingSenderId: "805611198114"
    // };
    // firebase.initializeApp(config);
    // // Assign the reference to the database to a variable named 'db'
    // var db = firebase.database();

    // global variables 
    var userCuisineChoice = "";
    var userLat = [];
    var userLng = [];
    var userPricePrefChoice = "";
    var userDistancePrefChoice = "";
    var randArray = [];
    var sugPlaceId = "";
    var restLat = [];
    var restLng = [];
    var map;
    var respLat = "";
    var respLng = "";

    // function to capture user input for cuisine type preference
    function userCuisine(e) {
        e.preventDefault();
        userCuisineChoice = $(this).attr("value");
    };

    // function to capture user input of zip code
    function userZip() {
        var zip = $("#zip").val();
        var queryURL = "http://maps.googleapis.com/maps/api/geocode/json?address=" + zip;

        // converts captured user input zip code to lat and lng coordinates for us to plug into google places ajax request
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            var lat = response.results[0].geometry.location.lat;
            var lng = response.results[0].geometry.location.lng;
            // pushes converted zip to global variables so that we can plug them into our google places ajax request
            userLat.push(lat);
            userLng.push(lng);
        });
    };

    // function to capture user input for price preference
    function userPricePref(e) {
        e.preventDefault();
        userPricePrefChoice = $(this).attr("value");
    };

    // function to capture user input for distance preference
    function userDistancePref(e) {
        e.preventDefault();
        userDistancePrefChoice = $(this).attr("value");
    }
    function diningSuggestion(e) {

        //proxy server to avoid CORS Error
        var proxy = "https://cors-anywhere.herokuapp.com/";
        var apiKey = "AIzaSyBtKj-tArTQ4Po2orxslb5AKe2v-7mcG90";
        var queryURL = proxy + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&keyword=" + userCuisineChoice + "&fields=photos,formatted_address,name,reviews[],opening_hours,rating,price_level=" + userPricePref + "&location=" + userLat + "," + userLng + "&radius=" + userDistancePrefChoice + "&key=" + apiKey;

        // ajax request to obtain restaurant details based on queryURL paramaters which are set by captured user inputs
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            // test
            console.log(response);
            // empties suggested restaurant div before displaying a new suggestion in it
            // $("#result").empty();
            // checks to make sure that we are getting a response based on user input parameters
            if (response.results.length > 0) {
                
            
            ///======push our respone into an array select from 
            randArray.push(response.results)
            // console.log(randArray);
            //======= function to go through the array and select a random result
            var randNumb = Math.floor((Math.random() * response.results.length) + 1);
            // console.log(randNumb);
            // test
            console.log(response.results[randNumb]);
            // sets value for place id which we will need to use to generate reviews later on
            sugPlaceId = response.results[randNumb].place_id;
            // sets values for lat and lng which we will need to use later on to generate a map for our restaurant suggestion location
            respLat = response.results[randNumb].geometry.location.lat;
            respLng = response.results[randNumb].geometry.location.lng;
            // console.log(respLat);
            // console.log(respLng);
            
            // creating html elements based on our api response data
            var name = $("<h1>").text(response.results[randNumb].name);
            var rating = $("<h3>").text("Rating: " + response.results[randNumb].rating + "!");
            var address = $("<h4>").text("Address: " + response.results[randNumb].vicinity);
        
            // appending created elements to one another so that they can be displayed together on the page
            rating.append(address);
            name.append(rating);

            // displays suggested restaurant name, rating, address on page for user to see
            $("#result").prepend(name);
            // show third page element which displays our restaurant suggestion
            $("#third-page").show();

            // if no results are found based on user input parameters, then we will display an element stating that no results were found instead of the sugestion element
            } else {
                $("#third-page").hide();
                $("#no-results-page").show();
            };
        });
        
    };

    // function photo() {
    //     // var photos = place.photos
    //     // var proxy = "https://cors-anywhere.herokuapp.com/";
    //     // var apiKey = "AIzaSyChlPJLAb8RprOEJSaNR45xofPCnhLRJk8";
    //     // var queryURL4 = proxy + "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAA2ABD0Awjf3I0HIdtLbIhuLbfIjYkwKIaruhulr_hpfLid-cAV-bXer0h-oBbaiA8GYOuLnKm9FP4WQOmpgasGF8PB4YYX_jtRr2AglO5UZcqLi646-EHo8wrKjuKIElREhA815XTXS1dywpSG4CnGX7kGhRzBZ24yBHQsg4YWIcKYC3-R9bQ6A&key=" + apiKey;
    //     // $.ajax({
    //     //     url: queryURL4,
    //     //     method: "GET",
    //     // }).then(function (response) {
    //     //     console.log(response);
    //     //     $("#results").append(response);



    //     // });
    // };

    // generates reviews for suggested restaurant
    function review() {
        // hides preloader element while this ajax request is being made so that it does not move elements around on the page while this request is being fetched
        $(document).ajaxStart(function () {
            //preloader hide
            $(".preloader-wrapper").hide();
        });
        
        var proxy = "https://cors-anywhere.herokuapp.com/";
        var apiKey = "AIzaSyChlPJLAb8RprOEJSaNR45xofPCnhLRJk8";
        var queryURL2 = proxy + "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + sugPlaceId + "&fields=name,review,formatted_phone_number&key=" + apiKey;

        // fetches reviews for suggested restaurant
        $.ajax({
            url: queryURL2,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            // clears out reviews for previous restaurant suggestions before displaying new suggested restaurant reviews
            $("#newReview").empty();
            // for loop to create a limit to the amount of review to be displayed
            for (var i = 0; i < 6; i++) {
                var pastReviews = $("<p id='review'>" + "* " + response.result.reviews[i].text + "</p>" + "<br>");
                // displays fetched reviews on our page
                $("#newReview").append(pastReviews);
            };
        });
    };

    // function to create a google map of our suggested restaurant location
    function generateMap() {
        // pulls in globally generated lat and lng for suggested restaurant
        var myLatLng = { lat: respLat, lng: respLng }
        // creates google map 
        map = new google.maps.Map(document.getElementById('myModalMap'), {
            center: myLatLng,
            zoom: 20
        });
        // creates marker for suggested restaurant on map which has been generated
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
        });
    };

    // fires function to capture user cuisine selection when a cuisine option button is clicked
    $(".btn-large").on("click", userCuisine);

    // fires function to capture user input zip when submit button from page 1 is clicked 
    $("#submit").on("click", function (e) {
        e.preventDefault();
        userZip();
        var submit = $("#zip").val();
        // checks to ensure that the user has entered a 5 digit zip
        if (submit.length < 5 || submit.length > 5) {
            alert("Invalid Zip");
        }
        else {
            $("#first-page").hide();
            $("#second-page").show();
        };
    });

    // fires function to capture user price preference when a price button is clicked
    $(".btn-medium").on("click", userPricePref);

    // fires function to capture user distance preference when a distance button is clicked
    $(".btn-small").on("click", userDistancePref);

    // fires function that fethces restaurant info and displays our restaurant suggestion
    $("#price-submit").on("click", function (e) {
        e.preventDefault();
       
        // displays loading icon while data is being fetched from api
        $(document).ajaxStart(function () {
            $(".preloader-wrapper").show();
        });
        // hides loading icon and displays suggestion after fetch has been completed
        $(document).ajaxComplete(function () {
            $(".preloader-wrapper").hide();
            $("#third-page").show();
        })
        // calls function that has our ajax request in it
        diningSuggestion();
        $("#second-page").hide();
    });

    // fetches review info and shows reviews modal 
    $("#reviews").on("click", function (e) {
        e.preventDefault();
        review();
        $("#modalReviews").show();
        // hides "reviews", "maps", "nah" buttons so that they are not floated over the reviews modal
        $(".btn-xlarge").hide();
    });

    // Hide modal review 
    $("#reviewsBack").on("click", function (e) {
        e.preventDefault();
        $("#modalReviews").hide();
        // show "reviews", "maps", "nah" buttons again
        $(".btn-xlarge").show();
    });

    // firest function to generate our suggested restaurant location map and show map modal
    $("#map").on("click", function (e) {
        e.preventDefault();
        generateMap();
        $("#modalMap").show();
        // hides "reviews", "maps", "nah" buttons so that they are not floated over the reviews modal
        $(".btn-xlarge").hide();
    });

    // Hide modal map
    $("#mapBack").on("click", function (e) {
        e.preventDefault();
        $("#modalMap").hide();
        // show "reviews", "maps", "nah" buttons again
        $(".btn-xlarge").show();
    });

    // fires function to generate a new suggestion
    $("#nahButton").on("click", function (e) {
        e.preventDefault();
        diningSuggestion();
        $("#second-page").hide();
    });

});