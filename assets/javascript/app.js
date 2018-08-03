$(document).ready(function(){

    
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
    
    function userPricePref (e) {
        e.preventDefault();
        // grabs user price choice 
        var newUserPricePref = $(this).attr("value");
       
        // creates local "temporary" object for holding new user price preference
        console.log("this is the user price range: " + newUserPricePref);
        // var newUserPricePref = {
        //     userPricePref: newUserPricePref,
        // }
        // // upload user price preference to the database
        // db.ref().push(newUserPricePref);
    }
    
    
    function userDistancePref () {
        // grabs user distance choice
        var userDistancePref = $(this).attr("value");
        console.log("this is the user distance preference: " + userDistancePref + " in meters (place api uses meters as length parameter)");
        // creates local "temporary" object for holding new user price preference
        // var newUserDistancePref = {
        //     userDistancePref: newUserDistancePref,
        // }
        // // upload user price preference to the database
        // db.ref().push(newUserDistancePref);
    }

    $(".btn-medium").on("click", userPricePref);
    $(".btn-small").on("click", userDistancePref);
});