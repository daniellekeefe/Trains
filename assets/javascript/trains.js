// SystemJS.import('/scripts/moment-with-locales.js').then(function(moment) {
//   moment.locale('fr');
// });
$(document).ready(function () {
    console.log("ready!");
  
    // Initialize Firebase
    // Make sure to match the configuration to the script version number in the HTML
    // (Ex. 3.0 != 3.7.0)
    let config = {
      apiKey: "AIzaSyAXgG7_7r77PfCQ4nrdcnKq-Ev0_GhIQNo",
      authDomain: "danielle-test-project.firebaseapp.com",
      databaseURL: "https://danielle-test-project.firebaseio.com",
      projectId: "danielle-test-project",
      storageBucket: "danielle-test-project.appspot.com",
      messagingSenderId: "375960205835",
      appId: "1:375960205835:web:2eb57cccde64468a04650e",
      measurementId: "G-KHQDC7VXLW"
    };
  
    firebase.initializeApp(config);
  
  
    // Create a variable to reference the database.
    let database = firebase.database();
  
    $('#add-train-btn').on('click', function (event) {
      event.preventDefault();
      //create temp obj for train data. what you see in firebase
      //take user input
      const trainName = $('#train-name-input').val().trim();
      const destination = $('#destination-input').val().trim();
      let trainTime = $('#first-train-input').val().trim();
      let trainFreq = $('#frequency-input').val().trim();
  
      //Variable for new train, this is exactly what is represented in FB
      let newTrain = {
        name: trainName,
        dest: destination,
        time: trainTime,
        freq: trainFreq
      };
  
      //push to details above to FB
      database.ref().push(newTrain);
  
      //parse the time incriments of the trains
      trainFreq = parseInt(trainFreq);
  
      //consolelog everything!
      console.log("Name/Place/Time/Frequency: " + trainName + "|" + destination + "|" + trainTime + "|" + trainFreq);
      alert("train successfully ADDED");
      //data from the input fields
      $('#train-name-input').val('');
      $('#rdestination-input').val('');
      $('#first-train-input').val('');
      $('#frequency-input').val('');
      //first train time, get prepared for calculations!
    })
    database.ref().on("child_added", function (childSnapshot) {
      console.log(childSnapshot)
      console.log(childSnapshot.val())
      //});
      let eachTrain = childSnapshot.val()
      //let
  
  
      var firstTimeConverted = moment(eachTrain.time, "HH:mm").subtract(1, "years");
      console.log("TIME CONVERTED: " + firstTimeConverted);
  
      var diffTime = moment.duration(moment().diff(moment(eachTrain.time, "HH:mm")), 'milliseconds').asMinutes();
      console.log("DIFFERENCE IN TIME: " + diffTime);
  
      var timeRemaining = eachTrain.freq - (Math.floor(diffTime) % eachTrain.freq);
      console.log(timeRemaining);
  
      //if statement, greater than zero calculate time till next train arrival time
      var nextTrain = diffTime > 0 ? moment().add(timeRemaining, 'minutes') : moment(eachTrain.time, "HH:mm");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
  
      var minTilTrain = Math.ceil(moment.duration(moment(nextTrain).diff(moment()), 'milliseconds').asMinutes());
      console.log("MINUTES TILL TRAIN: " + minTilTrain);
  
      let markup = "<tr><td>" + eachTrain.name + "</td><td>" + eachTrain.dest + "</td><td>" + eachTrain.freq + "</td><td>" + (nextTrain).format("hh:mm a") + "</td><td>" + minTilTrain + "</td></tr>";
      $("table tbody").append(markup);
  
  
    })
  });