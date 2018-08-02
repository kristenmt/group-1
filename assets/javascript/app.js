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

function userPricePref () {
    // grabs user price choice 
    var newUserPricePref = $(".price-choice").val();
    // creates local "temporary" object for holding new user price preference
    var newUserPricePref = {
        userPricePref: newUserPricePref,
    }
    // upload user price preference to the database
    db.ref().push(newUserPricePref);
}


function userDistancePref () {
    // grabs user distance choice
    var userDistancePref = $(".distance-choice").val();
    // creates local "temporary" object for holding new user price preference
    var newUserDistancePref = {
        userDistancePref: newUserDistancePref,
    }
    // upload user price preference to the database
    db.ref().push(newUserDistancePref);
}