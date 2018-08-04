$(document).ready(function () {

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
    var userCuisineChoice = [];
    var userLat = [];
    var userLng = [];
    var userPricePrefChoice = [];
    var userDistancePrefChoice = [];
    var randArray = [];

    function userCuisine(e) {
        e.preventDefault();
        var newUserCuisine = $(this).attr("value");
        userCuisineChoice.push(newUserCuisine);
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
        });
    }

    function userPricePref(e) {
        e.preventDefault();
        // grabs user price choice 
        var newUserPricePref = $(this).attr("value");
        // push to global variable
        userPricePrefChoice.push(newUserPricePref);

        // console.log("this is the user price range: " + userPricePrefChoice);
    }

    function userDistancePref(e) {
        e.preventDefault();
        // grabs user distance choice
        var newUserDistancePrefChoice = $(this).attr("value");
        userDistancePrefChoice.push(newUserDistancePrefChoice);
        // console.log("this is the user distance preference: " + userDistancePrefChoice + " in meters (place api uses meters as length parameter)");

    }
    function diningSuggestion(e) {
        e.preventDefault();
       
        //proxy server to avoid CORS Error
        var proxy = "https://cors-anywhere.herokuapp.com/";
        //var queryURL = proxy + "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyB89xW_iR3r4Jxih4DUu_Qz0QePc8sPWfU";
        // var queryURL = proxy + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.5383,81.3792&radius=160000&type=restaurant&keyword=" + userCuisineChoice + "&key=AIzaSyB89xW_iR3r4Jxih4DUu_Qz0QePc8sPWfU"
        var queryURL = proxy + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&keyword=" + userCuisineChoice + "&fields=photos,formatted_address,name,opening_hours,rating,price_level=1&location=" + userLat + "," + userLng + "&radius=" + userDistancePrefChoice + "&key=AIzaSyB89xW_iR3r4Jxih4DUu_Qz0QePc8sPWfU";
        
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            ///======push our respone into an array select from 
            randArray.push(response.results) 
            console.log(randArray);
            //======= function to go through the array and select a random result
            var randNumb = Math.floor((Math.random() * response.results.length) + 1);
            console.log(randNumb);
            console.log(response.results[randNumb]);
        });

    }
    $(".btn-large").on("click", userCuisine);
    $("#submit").on("click", function(e) {
        e.preventDefault();
        userZip();
        console.log(userCuisineChoice);
        console.log(userLat);
        console.log(userLng);
        $("#cuisineBttn").hide();
        $("#zipBox").hide();
    });
    $(".btn-medium").on("click", userPricePref);
    $(".btn-small").on("click", userDistancePref);
    $(".btn-xlarge").on("click", diningSuggestion);
});