var config = {
    apiKey: "AIzaSyCq_MFsghKM7-fo1sbvGL2ZuoYckU0MkfY",
    authDomain: "train-scheduler-909d0.firebaseapp.com",
    databaseURL: "https://train-scheduler-909d0.firebaseio.com",
    projectId: "train-scheduler-909d0",
    storageBucket: "train-scheduler-909d0.appspot.com",
    messagingSenderId: "849597634322"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  setInterval(update, 1000);

  $("#addTrain").on("click", function(event) {
    event.preventDefault();

    name = $("#trainName").val().trim();
    destination = $("#traindestination").val().trim();
    time = $("#firstTime").val().trim();
    frequency = $("#trainFrequency").val().trim();

    if(name == "" || destination == "" || time == "" || frequency == "") {
      console.log("Needed info")
    } else {

    database.ref().push({
      name: name,
      destination: destination,
      time: time,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  }

  });

  database.ref().on("child_added", function(snapshot) {
    var sv = snapshot.val();
    var tFrequency = parseInt(sv.frequency);
    var firstTime = moment(sv.time, "hh:mm")

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    var tRemainder = diffTime % tFrequency;

    var tMinutesTillTrain = tFrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    var nextArrival = moment(nextTrain).format("hh:mm");
    
    var minuntesAway = tMinutesTillTrain

    var $newRow = $('<tr>');

    var $data = $(`<td>${sv.name}</td><td>${sv.destination}</td><td>${sv.frequency}</td><td>${nextArrival}</td><td>${minuntesAway}</td>`);

    $newRow.append($data);
    $('tbody').append($newRow);

  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  function update() {
    $('#currentTime').html(moment().format('MMMM Do YYYY, h:mm:ss a'));
  }


