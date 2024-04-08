
function dataExercise() {
    var exerRef = db.collection("exercises");

    exerRef.add({
        name: "Running",
        type: "Stamina",
        points: 10,
        split: ""
    });

}


//function to populate the dropdown menu with exercises from the database.
function populateDrop() {
    const dropdown = document.getElementById('drop');
    dropdown.innerHTML = '<option value="">Select an option..</option>'

    db.collection('exercises').get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                //creates an option element
                const option = document.createElement('option');
                option.value = doc.id; // assigns doc id to determine which name to grab
                option.textContent = doc.data().name; // assigns name to option which is what we want to display
                dropdown.appendChild(option);

            });

        })
}
populateDrop();




//function that retrieves the data of a selected exercise from the dropdown menu. The type field is retrieved
//and layout changes depending if the type field has "Stamina".
function handleExerciseSelection() {
    let selectedExerciseId = document.getElementById('drop').value;
    let picker = document.getElementById('picker');
    let weightForm = document.getElementById('weightForm');
    let setForm = document.getElementById('setForm');
    let repForm = document.getElementById('repForm');
    let durationForm = document.getElementById('durationForm');
    if (!selectedExerciseId) return; // Ensuring an exercise is selected

    // Retrieve the exercise document from Firestore based on the exercise 
    db.collection('exercises').doc(selectedExerciseId).get()
        .then(doc => {
            if (doc.exists) {
                let exerciseData = doc.data();
                // Grabs "type" field from fire store
                let exerciseType = exerciseData.type;

                // Change the layout based on the value of 'type' field
                if (exerciseType === 'Stamina') {
                    // Change the layout for exercises with type 'Stamina'
                    weightForm.style.display = "none";
                    setForm.style.display = "none";
                    repForm.style.display = "none";
                    picker.style.display = "none";
                    durationForm.style.display = "flex";
                } else {
                    // Change the layout for exercises with other types
                    // TOMMY: i changed the display values to match its css ones cuz it was overwritting the css - NERIYEL - OK
                    weightForm.style.display = "flex";
                    setForm.style.display = "flex";
                    repForm.style.display = "flex";
                    picker.style.display = "grid";
                    durationForm.style.display = "none";
                }
            } else {
                // in case exercise does not exist is fire store
                console.log('No such document!');
            }
        })

}
//event listener for when exercise is chosen - any exercise chosen calls the handle exercise function
document.getElementById('drop').addEventListener('change', handleExerciseSelection);






// SCROLL WHEEL FUNCTIONS:
// generates (an array of) the options for sets and reps 
function generateOptions(start, end) {
    const options = [];
    for (let i = start; i <= end; i++) {
        options.push(i);
    }
    return options;
}

// Populates the options for sets and reps
function populatePicker(selector, start, end, inputElement) {
    const picker = document.querySelector(selector);
    const options = generateOptions(start, end);

    // map method: transforms each array item --> html div | join method: concats into one string (why tho?)
    picker.innerHTML = options.map(option => `<div class="option">${option}</div>`).join('');

    // adds event listener to each option
    const optionElements = picker.querySelectorAll('.option');

    optionElements.forEach(option => {
        option.addEventListener('click', () => {
            // removes 'selected' class from all other options not picked
            optionElements.forEach(opt => opt.classList.remove('selected'));
            // adds 'selected' class to the clicked option
            option.classList.add('selected');
            // updates the value of the setForm input with the clicked option
            inputElement.value = option.textContent;

            console.log(option.textContent);
        });
    });
};

// Initialize picker for SETS
const currentSet = document.getElementById('setsInput')
populatePicker('.sets', 1, 10, currentSet);

// Initialize picker for REPS
const currentReps = document.getElementById('repsInput');
populatePicker('.reps', 1, 99, currentReps);

// Separate functions for weight input (different increments)
function generateWeightOptions(start, end) {
    const options = [];
    for (let i = start; i <= end; i = i + 2.5) {
        options.push(i);
    }
    return options;
}

// Populates the options for weights starting from 2.5 and increasing by 2.5
function populateWeightPicker(start, end, increment, inputElement) {
    const picker = document.querySelector('.weight');
    const options = generateWeightOptions(start, end, increment);

    picker.innerHTML = options.map(option => `<div class="option">${option}</div>`).join('');

    const optionElements = picker.querySelectorAll('.option');

    optionElements.forEach(option => {
        option.addEventListener('click', () => {
            optionElements.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            inputElement.value = option.textContent;
        });
    });
}

// Initialize picker for weights starting from 2.5 and increasing by 2.5
const currentWeight = document.getElementById('weightInput');
populateWeightPicker(0, 500, 2.5, currentWeight);


// Adds the user's workout info to firebase (@ user's workout collection)
function submitSession() {
    console.log("inside submitSession");

    // Check if user is signed in
    const user = firebase.auth().currentUser;
    if (!user) {
        console.log("User is not signed in.");
        alert("You are not signed in. Please sign in to submit a workout.");
        return; // Exit the function if user is not signed in
    }

    // Constants for the user's input values
    var exerciseName = document.getElementById('drop').value;
    var weightValue = document.getElementById('weightInput').value;
    var setsValue = document.getElementById('setsInput').value;
    var repsValue = document.getElementById('repsInput').value;
    var durationValue = document.getElementById('durationInput').value;

    //
    var condition = false;
    // Ensures user has selected an exercise.
    if (!exerciseName) {
        alert("Please select an exercise.");
    }

    // If duration is filled in, weight,sets,repsValues can be left empty

    // Retrieve the exercise 'type' based on its uniqueID
    db.collection('exercises').doc(exerciseName).get()
        .then((doc => {
            if (doc && doc.data()) {
                const exerciseType = doc.data().type;
                //ADDED A CONSTANT TO GRAB NAME OF EXERCISE - TOMMY -SICKKK
                const exerName = doc.data().name;
                console.log(exerciseType);
                // Checks exercise type and validate input per exercise type
                var staminaExerciseIsChosen = exerciseType === 'Stamina';
                if (staminaExerciseIsChosen) {
                    if (!durationValue) {
                        alert("Please fill in all information.");
                        return;
                    }
                } else {
                    if (!exerciseName || !weightValue || !setsValue || !repsValue) {
                        alert("Please fill in all information.");
                        return;
                    }
                }

                // Adds the form inputs to user's workout collection
                const userWorkoutRef = db.collection('users').doc(user.uid).collection('workouts');

                // Create a Date object. More convenient to manipulate the Date values.
                let sessionDateAndTime = new Date();
                // Split the string to get the date only
                let sessionDateOnly = `${sessionDateAndTime.toLocaleString('default', { month: 'long' })} ${sessionDateAndTime.getDate()}, ${sessionDateAndTime.getFullYear()}`;

                userWorkoutRef.add({
                    //CHANGED VARIABLE NAME SO THAT IT ADDS THE NAME OF THE EXERCISE INTO THE FIELD - TOMMY
                    exercise: exerName,
                    weight: weightValue,
                    sets: setsValue,
                    reps: repsValue,
                    duration: durationValue,
                    //ADDED DATE TO WORKOUT FIELD (date+time and dateOnly)
                    date: sessionDateAndTime,
                    dateOnly: sessionDateOnly
                })

                    .then(function (docRef) {
                        console.log('Add Session written with ID: ', docRef.id);
                        // Clears the input fields after successful submission
                        document.getElementById('weightInput').value = '';
                        document.getElementById('setsInput').value = '';
                        document.getElementById('repsInput').value = '';
                        document.getElementById('durationInput').value = '';

                        // Populate history after successful submission
                        populateWorkoutSessionHistory();
                    })

                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });
                //Code to get points from the exercise they added and add it to the users Strength/Stamina/Speed field
                let points = doc.data().points;
                let userStatsPointer = db.collection('users').doc(user.uid);
                userStatsPointer.get().then((docSnapshot) => {
                    if (docSnapshot.exists) {
                        let userStats = docSnapshot.data();
                        let userStrength = userStats.Strength;
                        let userStamina = userStats.Stamina;
                        let userSpeed = userStats.Speed;
                        if (exerciseType === 'Strength') {
                            let multiply = 5 * points;
                            let total = userStrength + multiply;
                            userStatsPointer.update({
                                Strength: total
                            })
                        }
                        if (exerciseType === 'Stamina') {
                            let multiply1 = 5 * points;
                            let total1 = userStamina + multiply1;
                            userStatsPointer.update({
                                Stamina: total1
                            })
                        }
                        if (exerciseType === 'Speed') {
                            let multiply2 = 5 * points;
                            let total2 = userSpeed + multiply2;
                            userStatsPointer.update({
                                Speed: total2
                            })
                        }
                    }

                })
                // calls the function to open the confirmation screen
                performAction();
            } else {
                alert("No such exercise exists, please choose from the dropdown");
            }
        }));
}

// populates the workout history of current session, listens for authentication state changes
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in. You can call functions that require authentication here.
        // For example, you can call populateWorkoutSessionHistory().
        populateWorkoutSessionHistory();
    } else {
        // User is signed out. Handle this case if needed.
        console.log("User is not signed in.");
        // If you want to alert the user, uncomment the line below:
        // alert("You are not signed in. Please sign in to submit a workout.");
    }
});

// Utilizes the workout card template nodes
function populateWorkoutSessionHistory() {

    // Clear the workout history container first (prevents duplicates)
    document.getElementById("workoutHistoryGroup").innerHTML = "";

    // Check if user is signed in
    const user = firebase.auth().currentUser;
    if (!user) {
        console.log("User is not signed in.");
        alert("You are not signed in. Please sign in to submit a workout.");
        return; // Exit the function if user is not signed in
    }

    console.log("inside populateWorkoutSessionHistory");
    let workoutHistoryTemplate = document.getElementById("workoutHistoryTemplate");
    let workoutHistoryGroup = document.getElementById("workoutHistoryGroup");

    // Again, sessionID will be the current date (no time stamp)
    let sessionDateAndTime = new Date();
    // Split the string to get the date only
    let sessionID = `${sessionDateAndTime.toLocaleString('default', { month: 'long' })} ${sessionDateAndTime.getDate()}, ${sessionDateAndTime.getFullYear()}`;

    console.log("Date of session:", sessionID);

    db.collection('users').doc(user.uid).collection('workouts')
        // Filters current session via current date
        .where("dateOnly", "==", sessionID)
        .get()
        .then((allWorkouts) => {
            workouts = allWorkouts.docs;
            console.log("list of workouts: " + workouts);
            workouts.forEach((doc) => {
                var exercise = doc.data().exercise;
                var weight = doc.data().weight;
                var reps = doc.data().reps;
                var sets = doc.data().sets;
                var duration = doc.data().duration;
                var docID = doc.id;

                // cloneNode creates copies of the workoutHistoryTemplate
                let workoutCard = workoutHistoryTemplate.content.cloneNode(true);
                workoutCard.getElementById("exerciseHistory").innerHTML = exercise;
                workoutCard.getElementById("weightHistory").innerHTML = `Weight <span id="metric">(lb)</span> ${weight}`;
                workoutCard.getElementById("repsHistory").innerHTML = `Reps: ${reps}`;
                workoutCard.getElementById("setsHistory").innerHTML = `Sets: ${sets}`;
                // workoutCard.getElementById("durationHistory").innerHTML = `Duration: ${duration}`;

                //NOTE:  this is where we assign the Event Listener to the delete button
                // We pass along the document ID (of the hike) to the Handler function
                // This ID is a String object, and must be enclosed in quotes 
                workoutCard.querySelector('button').setAttribute('onclick', 'deleteWorkout("' + docID + '")');

                // Appends the new workout card to the workoutHistoryGroup HTML element
                workoutHistoryGroup.appendChild(workoutCard);
            });
        });
}

function deleteWorkout(id) {
    console.log("delete workout with id " + id);

    db.collection("users").doc(firebase.auth().currentUser.uid).collection("workouts").doc(id).delete().then(() => {
        console.log("Document succesfully deleted!");
        location.reload();   //refresh page
    }).catch( (error) => {
        console.error("error removing document: ", error);
    });
    
}

// Function for the modal to show up if no error
function performAction() {
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.show();
}

// Uncomment (for now?) because it only deletes exercise from webpage, not firebase
// // Deletes a workout from the user's workout selection
// function deleteExercise(button) {
//     var workoutCard = button.parentNode;

//     // Deletes from webpage, not from firestore (yet!)
//     workoutCard.remove();

//     // Deletes from firestore
//     const exerciseID = workoutCard.exerciseSessionID;
//     console.log(exerciseID);

//     if (!exerciseID) {
//         console.log("Exercise ID not found!");
//         alert("Exercise ID not found");
//         return;
//     }

//     db.collection('users').doc(firebase.auth().currentUser.uid).collection('workouts').doc(exerciseID)
//         .delete()
//         .then(function () {
//             console.log("Exercise deleted successfully");
//         })
// }



