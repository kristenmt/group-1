$(document).ready(function () {
    // Hide second page on initial html loading
    $("#second-page").hide();
    // Hide last page on initial html loading
    $("#third-page").hide();
    //Preloader hide
    $(".preloader-wrapper").hide();
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
    var map;
    var respLat = "";
    var respLng = "";
    function userCuisine(e) {
        e.preventDefault();
        userCuisineChoice = $(this).attr("value");
    };
    function userZip() {
        var zip = $("#zip").val();
        var queryURL = "http://maps.googleapis.com/maps/api/geocode/json?address=" + zip;

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            var lat = response.results[0].geometry.location.lat;
            var lng = response.results[0].geometry.location.lng;
            userLat.push(lat);
            userLng.push(lng);
        });
    };
    function userPricePref(e) {
        e.preventDefault();
        userPricePrefChoice = $(this).attr("value");
    }
    function userDistancePref(e) {
        e.preventDefault();
        userDistancePrefChoice = $(this).attr("value");
    }
    function diningSuggestion(e) {

        //proxy server to avoid CORS Error
        var proxy = "https://cors-anywhere.herokuapp.com/";
        var apiKey = "AIzaSyChlPJLAb8RprOEJSaNR45xofPCnhLRJk8";
        var queryURL = proxy + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&keyword=" + userCuisineChoice + "&fields=photos,formatted_address,name,reviews[],opening_hours,rating,price_level=" + userPricePref + "&location=" + userLat + "," + userLng + "&radius=" + userDistancePrefChoice + "&key=" + apiKey;

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
            respLat = response.results[randNumb].geometry.location.lat;
            respLng = response.results[randNumb].geometry.location.lng;
            console.log(respLat);
            console.log(respLng);

            var name = $("<h1>").text(response.results[randNumb].name);
            var rating = $("<h3>").text("Rating: " + response.results[randNumb].rating + "!");
            var address = $("<h4>").text("Address: " + response.results[randNumb].vicinity);
            // var photos = $("<img src='" + response.results[randNumb].photos[0] + "'/>");

            // address.append(photos);
            rating.append(address);
            name.append(rating);

            $("#result").append(name);

            $("#third-page").show();
        });
    };
    function photo() {
        // var photos = place.photos
        // var proxy = "https://cors-anywhere.herokuapp.com/";
        // var apiKey = "AIzaSyChlPJLAb8RprOEJSaNR45xofPCnhLRJk8";
        // var queryURL4 = proxy + "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAA2ABD0Awjf3I0HIdtLbIhuLbfIjYkwKIaruhulr_hpfLid-cAV-bXer0h-oBbaiA8GYOuLnKm9FP4WQOmpgasGF8PB4YYX_jtRr2AglO5UZcqLi646-EHo8wrKjuKIElREhA815XTXS1dywpSG4CnGX7kGhRzBZ24yBHQsg4YWIcKYC3-R9bQ6A&key=" + apiKey;
        // $.ajax({
        //     url: queryURL4,
        //     method: "GET",
        // }).then(function (response) {
        //     console.log(response);
        //     $("#results").append(response);



        // });
    };
    function review() {
        var proxy = "https://cors-anywhere.herokuapp.com/";
        var apiKey = "AIzaSyChlPJLAb8RprOEJSaNR45xofPCnhLRJk8";
        var queryURL2 = proxy + "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + sugPlaceId[0] + "&fields=name,review,formatted_phone_number&key=" + apiKey;
        $.ajax({
            url: queryURL2,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            for (var i = 0; i < 6; i++) {
                var pastReviews = $("<p id='review'>" + "* " + response.result.reviews[i].text + "</p>" + "<br>");
                $("#modalReviews").append(pastReviews);
            };
        });
    };

    function generateMap() {
        var myLatLng = { lat: respLat, lng: respLng }
        map = new google.maps.Map(document.getElementById('myModalMap'), {
            center: myLatLng,
            zoom: 15
        });
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: "restaurant name"
        });
    };
    $(".btn-large").on("click", userCuisine);
    //when user adds cuisine and zip code and clicks submit, pg 1 hides, pg 2 shows up
    $("#submit").on("click", function (e) {
        e.preventDefault();
        userZip();
        $("#first-page").hide();
        $("#second-page").show();
    });
    $(".btn-medium").on("click", userPricePref);
    $(".btn-small").on("click", userDistancePref);
    //when user clicks button on pg 2 to get suggestions, pg 2 hides, pg 3 shows up
    $("#price-submit").on("click", function (e) {
        e.preventDefault();
        $(document).ajaxStart(function () {
            $(".preloader-wrapper").show();
            // $("#wait").css("display", "block");
        });
        $(document).ajaxComplete(function () {
            $(".preloader-wrapper").hide();
            $("#third-page").show();
            // $("#wait").css("display", "none");
        })
        diningSuggestion();
        $("#second-page").hide();
    });
    //Show modal review
    $("#reviews").on("click", function (e) {
        e.preventDefault();
        review();
        $("#modalReviews").show();
        $(".btn-xlarge").hide();
    });
    //Hide modal review
    $("#reviewsBack").on("click", function (e) {
        e.preventDefault();
        $("#modalReviews").hide();
        $(".btn-xlarge").show();
    });
    //Show modal map
    $("#map").on("click", function (e) {
        e.preventDefault();
        generateMap();
        $("#modalMap").show();
    });
    //Hide modal map
    $("#mapBack").on("click", function (e) {
        e.preventDefault();
        $("#modalMap").hide();
    });

});