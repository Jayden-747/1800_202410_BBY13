
function dataExercise() {
    var exerRef = db.collection("exercises");

    exerRef.add({
        name: "Pylometrics",
        type: "Speed",
        points: 4

    });

    exerRef.add({
        name: "Lunges",
        type: "Strength",
        points: 3

    });

    exerRef.add({
        name: "Barbell Rows",
        type: "Strength",
        points: 3

    });

    exerRef.add({
        name: "Barbell Shoulder Presses",
        type: "Strength",
        points: 3

    });

    exerRef.add({
        name: "Cycling",
        type: "Stamina",
        points: 3
    });

    exerRef.add({
        name: "Swimming",
        type: "Stamina",
        points: 3
    });

    exerRef.add({
        name: "Stair Masters",
        type: "Stamina",
        points: 4
    });

    exerRef.add({
        name: "Elliptical",
        type: "Stamina",
        points: 2
    });

    exerRef.add({
        name: "High Intensity Interval Training (HIIT)",
        type: "Stamina",
        points: 5

    });

    exerRef.add({
        name: "Bicep curls",
        type: "Strength",
        points: 2

    });

    exerRef.add({
        name: "Skull Crushers",
        type: "Strength",
        points: 3
    });

    exerRef.add({
        name: "Dips",
        type: "Strength",
        points: 3
    });

    exerRef.add({
        name: "Pull Ups",
        type: "Strength",
        points: 5
    });

    exerRef.add({
        name: "Chin Ups",
        type: "Strength",
        points: 5
    });

    exerRef.add({
        name: "Overhead Tricep Extensions",
        type: "Strength",
        points: 3
    });

    exerRef.add({
        name: "Push Ups",
        type: "Strength",
        points: 3
    });
    exerRef.add({
        name: "Sit Ups",
        type: "Strength",
        points: 3
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

// SCROLL WHEEL FUNCTIONS:
// generates (an array of) the options for sets and reps 
function generateOptions(start, end) {
    const options = [];
    for (let i = start; i <= end; i++) {
        // ternary operator (below) just ensures 2 digit formatting
        options.push(i < 10 ? '0' + i : i);
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


// Listen for authentication state changes
// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//         // User is signed in.
//         console.log("User is signed in:", user.uid);
//         // Call submitSession function with the current user object
//         submitSession(user);
//     } else {
//         // No user is signed in.
//         console.log("No user is signed in.");
//         alert("You are not signed in. Please sign in to submit a workout.");
//     }
// });

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

    // Check if any input field is empty
    if (!exerciseName || !weightValue || !setsValue || !repsValue) {
        alert("Please fill in all information.");
        return; // Exit the function if any field is empty
    }

    // Adds the form inputs to user's workout collection
    const userWorkoutRef = db.collection('users').doc(user.uid).collection('workouts');
    userWorkoutRef.add({
        exercise: exerciseName,
        weight: weightValue,
        sets: setsValue,
        reps: repsValue
    })
        .then(function (docRef) {
            console.log('Add Session written with ID: ', docRef.id);
            // Clears the input fields after successful submission
            document.getElementById('weightInput').value = '';
            document.getElementById('setsInput').value = '';
            document.getElementById('repsInput').value = '';
        })
}