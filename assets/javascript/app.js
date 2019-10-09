// HW7 Firebase assignment basic - Train Scheduler

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyDkBB8vqH1N9gjPMt_Uo1glo1kYG6Cr3hs",
    authDomain: "hw7-eric.firebaseapp.com",
    databaseURL: "https://hw7-eric.firebaseio.com",
    projectId: "hw7-eric",
    storageBucket: "",
    messagingSenderId: "641453078336",
    appId: "1:641453078336:web:46a8af20f9eb9ae3eaeca5"
};
firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database.
var database = firebase.database();

// Capture entered data when submit button clicked
$("#submitButton").on("click", function (event) {
    event.preventDefault();

    // get user input
    var trainNameIn = $("#trainNameInput").val().trim();
    var destinationIn = $("#destinationInput").val().trim();
    var firstTrainTimeIn = moment($("#firstTrainTimeInput").val().trim(), "HH:mm").format("HH:mm");
    var frequencyIn = $("#frequencyInput").val().trim();

    // create local temporary object for holding user input
    var newTrainInformation = {
        trainName: trainNameIn,
        destination: destinationIn,
        firstTrainTime: firstTrainTimeIn,
        frequency: frequencyIn
    };

    // upload entered data to the database
    database.ref().push(newTrainInformation);

    // clears all of the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainTimeInput").val("");
    $("#frequencyInput").val("");
});

// create firebase event for adding train information to the database
// and a row in the html when a user adds entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // store everything into variables
    var trainNameVar = childSnapshot.val().trainName;
    var destinationVar = childSnapshot.val().destination;
    var frequencyVar = childSnapshot.val().frequency;
    var firstTrainTimeVar = childSnapshot.val().firstTrainTime;

    // calculation part
    // first time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTimeVar, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // time apart (remainder)
    var timeRemainder = diffTime % frequencyVar;
    console.log(timeRemainder);

    // minute Until Train
    var timeMinutesTillTrain = frequencyVar - timeRemainder;
    console.log("MINUTES TILL TRAIN: " + timeMinutesTillTrain);

    // next Train
    var nextTrain = moment().add(timeMinutesTillTrain, "minutes");
    var nextArrivalVar = moment(nextTrain).format("hh:mm A");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));


    // create new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainNameVar),
        $("<td>").text(destinationVar),
        $("<td>").text(frequencyVar),
        $("<td>").text(nextArrivalVar),
        $("<td>").text(timeMinutesTillTrain)
    );

    // append the new row to the table
    $(".table > tbody").append(newRow);
});