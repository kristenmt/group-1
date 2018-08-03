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
    var userCuisineChoice = "chinese";
    var userLat = [];
    var userLng = [];
    var userPricePrefChoice = [];
    var userDistancePrefChoice = 32187;
    var randArray = [];
    function userCuisine(e) {
        e.preventDefault();
        var newUserCuisine = $(this).attr("value");
        userCuisineChoice.push(newUserCuisine);
        console.log("this is you cuisine choice: " + userCuisineChoice);
        console.log("this is the user price range: " + userPricePrefChoice);
        console.log("this is the user distance preference: " + userDistancePrefChoice + " in meters (place api uses meters as length parameter)");
    }
    function userZip(e) {
        // e.preventDefault();
        var zip = 45377;
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
            console.log(userLat);
            console.log(userLng);

        });

    }
    function userPricePref(e) {
        e.preventDefault();
        // grabs user price choice 
        var newUserPricePref = $(this).attr("value");
        // Object.freeze(newUserPricePref);
        // push to global variable
        userPricePrefChoice.push(newUserPricePref);

        // creates local "temporary" object for holding new user price preference
        console.log("this is the user price range: " + userPricePrefChoice);
        // var newUserPricePref = {
        //     userPricePref: newUserPricePref,
        // }
        // // upload user price preference to the database
        // db.ref().push(newUserPricePref);
    }


    function userDistancePref(e) {
        e.preventDefault();
        // grabs user distance choice
        var newUserDistancePrefChoice = $(this).attr("value");
        userDistancePrefChoice.push(newUserDistancePrefChoice);
        console.log("this is the user distance preference: " + userDistancePrefChoice + " in meters (place api uses meters as length parameter)");

    }
    function diningSuggestion(e) {
        e.preventDefault();
        //console.log(childSnapshot.val());
        // var userCuisineChoice = "chinese";
        // var userPricePrefChoice = 4;
        // var userDistancePrefChoice = 8000;
        //proxy server to avoid CORS Error
        var proxy = "https://cors-anywhere.herokuapp.com/";
        //var queryURL = proxy + "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyB89xW_iR3r4Jxih4DUu_Qz0QePc8sPWfU";
        // var queryURL = proxy + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.5383,81.3792&radius=160000&type=restaurant&keyword=" + userCuisineChoice + "&key=AIzaSyB89xW_iR3r4Jxih4DUu_Qz0QePc8sPWfU"
        var queryURL = proxy + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&keyword=" + userCuisineChoice + "&fields=photos,formatted_address,name,opening_hours,rating,price_level&location=" + userLat + "," + userLng + "&radius=" + userDistancePrefChoice + "&key=AIzaSyB89xW_iR3r4Jxih4DUu_Qz0QePc8sPWfU";
        // console.log("this is you cuisine choice: " + userCuisineChoice);
        // console.log("this is the user price range: " + userPricePrefChoice);
        // console.log("this is the user distance preference: " + userDistancePrefChoice + " in meters (place api uses meters as length parameter)");
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
    $(".btn-large").on("click", function () {
        // $("#cuisine-choice-div").hide();
    });
    $(".brand-logo").on("click", userZip);
    $(".btn-medium").on("click", userPricePref);
    $(".btn-small").on("click", userDistancePref);
    $(".btn-xlarge").on("click", diningSuggestion);
});