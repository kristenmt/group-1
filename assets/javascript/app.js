$(document).ready(function () {
    // Hide second page on initial html loading
    $("#second-page").hide();
    // Hide last page on initial html loading
    $("#third-page").hide();
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA_VMGGZF6Q-BW970FUV9RJMBwZ16ETqbA",
        authDomain: "foodapp-5d5d5.firebaseapp.com",
        databaseURL: "https://foodapp-5d5d5.firebaseio.com",
        projectId: "foodapp-5d5d5",
        storageBucket: "",
        messagingSenderId: "805611198114"
    };

    firebase.initializeApp(config);

    // Assign the reference to the database to a variable named 'db'
    var db = firebase.database();
    // global variables 
    var userCuisineChoice = "";
    var userLat = [];
    var userLng = [];
    var userPricePrefChoice = "";
    var userDistancePrefChoice = "";
    var randArray = [];
    var sugPlaceId = [];
    var restLat = [];
    var restLng = [];

    function userCuisine(e) {
        e.preventDefault();
        // var newUserCuisine = $(this).attr("value");
        userCuisineChoice = $(this).attr("value");
    }

    function userZip() {
        var zip = $("#zip").val();
        var queryURL = "http://maps.googleapis.com/maps/api/geocode/json?address=" + zip;
        
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            // console.log(response);
            var lat = response.results[0].geometry.location.lat;
            var lng = response.results[0].geometry.location.lng;
            
            userLat.push(lat);
            userLng.push(lng);

            // console.log(userLat);
            // console.log(userLng);
        });
    }

    function userPricePref(e) {
        e.preventDefault();
        // grabs user price choice 
        // var newUserPricePref = $(this).attr("value");
        // push to global variable
        userPricePrefChoice = $(this).attr("value");

        // console.log("this is the user price range: " + userPricePrefChoice);
    }

    function userDistancePref(e) {
        e.preventDefault();
        // grabs user distance choice
        //  var newUserDistancePrefChoice = $(this).attr("value");
        userDistancePrefChoice = $(this).attr("value");
        // console.log("this is the user distance preference: " + userDistancePrefChoice + " in meters (place api uses meters as length parameter)");

    }
    function diningSuggestion(e) {
        // e.preventDefault();
       
        //proxy server to avoid CORS Error
        var proxy = "https://cors-anywhere.herokuapp.com/";
        var apiKey = "AIzaSyChlPJLAb8RprOEJSaNR45xofPCnhLRJk8";
        //var queryURL = proxy + "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyB89xW_iR3r4Jxih4DUu_Qz0QePc8sPWfU";
        // var queryURL = proxy + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.5383,81.3792&radius=160000&type=restaurant&keyword=" + userCuisineChoice + "&key=AIzaSyB89xW_iR3r4Jxih4DUu_Qz0QePc8sPWfU"
        var queryURL = proxy + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&keyword=" + userCuisineChoice + "&fields=photos,formatted_address,name,reviews[],opening_hours,rating,price_level=" + userPricePref + "&location=" + userLat + "," + userLng + "&radius=" + userDistancePrefChoice + "&key=" + apiKey;

        // var queryURL2 = proxy + "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + sugPlaceId[0] + "&fields=name,review,formatted_phone_number&key=" + apiKey;
        
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            ///======push our respone into an array select from 
            randArray.push(response.results) 
            // console.log(randArray);
            //======= function to go through the array and select a random result
            var randNumb = Math.floor((Math.random() * response.results.length) + 1);
            // console.log(randNumb);
            console.log(response.results[randNumb]);
            // var restaurantImage = $("<img src='" + response.results[randNumb].photos[0].photo_reference + "'>");
            var placeId = response.results[randNumb].place_id;
            sugPlaceId.push(placeId);
            // console.log(sugPlaceId);
            var name = $("<h1>").text(response.results[randNumb].name);
            var rating = $("<h3>").text("Rating: " + response.results[randNumb].rating + "!");
            var address = $("<h4>").text("Address: " + response.results[randNumb].vicinity);
            // var photo = $("<img src='" + response.results[randNumb].photos[0] + "'/>");
            // address.append(photo);
            rating.append(address);
            name.append(rating);

            // var reviews = 
            // suggestedChoice.append(name);
            $("#result").append(name);
            $("#third-page").show();
        });
    };

    function photo () { 

        var proxy = "https://cors-anywhere.herokuapp.com/";
        var apiKey = "AIzaSyChlPJLAb8RprOEJSaNR45xofPCnhLRJk8";
        var queryURL2 = proxy + "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + sugPlaceId[0] + "&fields=name,review,formatted_phone_number&key=" + apiKey;

        $.ajax({
            url: queryURL2,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            

            // console.log(sugPlaceId);
        });
    };


    function review () {

        var proxy = "https://cors-anywhere.herokuapp.com/";
        var apiKey = "AIzaSyChlPJLAb8RprOEJSaNR45xofPCnhLRJk8";
        var queryURL2 = proxy + "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + sugPlaceId[0] + "&fields=name,review,formatted_phone_number&key=" + apiKey;

        $.ajax({
            url: queryURL2,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            for (var i=0; i<6; i++) {
                var pastReviews = $("<p id='review'>" + response.result.reviews[i].text + "</p>");

                $("#modalReviews").append(pastReviews);
            };

            // console.log(sugPlaceId);
        });
    };

    // var map;
    // function initMap() {
    //     map = new google.maps.Map(document.getElementById("result"), {
    //         center: { lat: -34.397, lng: 150.644 },
    //         zoom: 8
    //     });
    // };

    function map () {

        // var sugRestaurant = "Pei Wei";
        // var apiKey = "AIzaSyChlPJLAb8RprOEJSaNR45xofPCnhLRJk8";
        // var source = "https://www.google.com/maps/embed/v1/search";
        // var newMap = $("<iframe src=" + source + "?q=" + sugRestaurant + "&key=" + apiKey + "</iframe>");
        var proxy = "https://cors-anywhere.herokuapp.com/";
        var apiKey = "AIzaSyChlPJLAb8RprOEJSaNR45xofPCnhLRJk8";
        

        var queryURL3 = proxy + "https://maps.googleapis.com/maps/api/js?key=" + apiKey;
        console.log(queryURL3);

            // var map;
            // function initMap() {
            //      map = new google.maps.Map(document.getElementById("result"), {
            //         center: { lat: -34.397, lng: 150.644 },
            //         zoom: 8
            //     });
            // };
            

            // var restaurant = { lat: 28.658758, lng: -81.4223438 };
            // var restMap = new google.maps.Map(
            //     document.getElementById("resultsBtn"), { zoom: 4, center: restaurant });
            // var marker = new google.maps.Marker({ position: restaurant, map: restMap });

            // var newMap = $("<iframe src=" + source + "?q=" + sugRestaurant + "&key=" + apiKey + "</iframe>");
            // // console.log(sugPlaceId);
        
    };


    $(".btn-large").on("click", userCuisine);
    //when user adds cuisine and zip code and clicks submit, pg 1 hides, pg 2 shows up
    $("#submit").on("click", function(e) {
        e.preventDefault();
        userZip();
        console.log(userCuisineChoice);
        console.log(userLat);
        console.log(userLng);
        //$("#cuisineBttn").hide();
        //$("#zipBox").hide();
        $("#first-page").hide();
        $("#second-page").show();
        console.log("Cuisine and zip code entered");
    });
    $(".btn-medium").on("click", userPricePref);
    $(".btn-small").on("click", userDistancePref);
    // $(".btn-xlarge").on("click", diningSuggestion);
    //when user clicks button on pg 2 to get suggestions, pg 2 hides, pg 3 shows up
    $("#price-submit").on("click", function(e) {
        e.preventDefault();
        console.log(userPricePrefChoice);
        console.log(userDistancePrefChoice);
        diningSuggestion();
        $("#second-page").hide();
        // $("#third-page").show();
    });
    $("#reviews").on("click", function (e) {
        e.preventDefault();
        review();
        $("#modalReviews").show();
    });
    // $("#map").on("click", function(e) {
    //     e.preventDefault();
    //     map();
    // });
});