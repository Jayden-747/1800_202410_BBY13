
function dataExercise() {
    var exerRef = db.collection("exercises");

    exerRef.add({
        name: "Pylometrics",
        type: "Speed",
        points: 4

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
    //for errors I guess??
    // .catch(error => {
    //     console.error('Error getting firestoredata: ', error);
    // });
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
                // Assuming 'type' is the field you want to use for layout change
                let exerciseType = exerciseData.type;

                // Change the layout based on the value of 'type' field
                if (exerciseType === 'Stamina') {
                    // Change the layout for exercises with type 'Stamina'
                    // For example, show/hide certain divs, change CSS classes, etc.
                    weightForm.style.display = "none";
                    setForm.style.display = "none";
                    repForm.style.display = "none";
                    picker.style.display = "none";
                    durationForm.style.display = "flex";
                } else {
                    // Change the layout for exercises with other types
                    // For example, show/hide different divs, change CSS classes, etc.
                    // TOMMY: i changed the display values to match its css ones cuz it was overwritting the css - NERIYEL
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
// Add event listener for when exercise is chosen - any exercise chosen calls the handle exercise function
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
populateWeightPicker(2.5, 500, 2.5, currentWeight);

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

    // Ensures user has selected an exercise.
    if(!exerciseName) {
        alert("Please select an exercise.");
    }

    // If duration is filled in, weight,sets,repsValues can be left empty

    // Retrieve the exercise 'type' based on its uniqueID
    db.collection('exercises').doc(exerciseName).get()
        .then((doc => {
            if (doc && doc.data()) {
                const exerciseType = doc.data().type;
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

                //////// Adds the form inputs to user's workout collection
                const userWorkoutRef = db.collection('users').doc(user.uid).collection('workouts');
                userWorkoutRef.add({
                    exercise: exerciseName,
                    weight: weightValue,
                    sets: setsValue,
                    reps: repsValue,
                    duration: durationValue
                })
                    .then(function (docRef) {
                        console.log('Add Session written with ID: ', docRef.id);
                        // Clears the input fields after successful submission
                        document.getElementById('weightInput').value = '';
                        document.getElementById('setsInput').value = '';
                        document.getElementById('repsInput').value = '';
                        document.getElementById('durationInput').value = '';

                    })
                    .catch(function (error) {
                        console.error("Error adding documet: ", error);
                    });
            } else {
                alert("No such exercise exists, please choose from the dropdown@");
            }
        }));
    }