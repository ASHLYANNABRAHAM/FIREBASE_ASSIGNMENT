$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyAZQ2892guXGxMbqC2a6CwH1ih4YBBhr8M",
        authDomain: "fir-assignment-3cb03.firebaseapp.com",
        databaseURL: "https://fir-assignment-3cb03.firebaseio.com",
        projectId: "fir-assignment-3cb03",
        storageBucket: "fir-assignment-3cb03.appspot.com",
        messagingSenderId: "364413436466"
    };
    firebase.initializeApp(config);


    var database = firebase.database();

    // Variables 
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function () {
        event.preventDefault();
        // Storing and retreiving new train data
        name = $("#train-name").val();
        destination = $("#destination").val();
        firstTrain = $("#first-train").val();
        frequency = $("#frequency").val();

        // Pushing to database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });
    database.ref().on("child_added", function (childSnapshot) {
        var nextArr;
        var minAway;

        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm");
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        var minAway = childSnapshot.val().frequency - remainder;
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextTrain +
            "</td><td>" + minAway + "</td></tr>");


    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });


});