
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
            // Chooses type filled in exercise document 
            let exerciseType = exerciseData.type;
            // Change the layout based on the value of 'type' field
            if (exerciseType === 'Stamina') {
                // Change the layout for exercises with type 'Stamina'
                weightForm.style.display = "none";
                setForm.style.display = "none";  
                repForm.style.display = "none";  
                picker.style.display = "none";
                durationForm.style.display = "block";
            } else {
                // Change the layout for exercises with other types
                weightForm.style.display = "";
                setForm.style.display = "";  
                repForm.style.display = "";  
                picker.style.display = "flex";
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

// Add event listener to the add button that stores exercise chosen and amount of sets and reps to a user

// reference to user document that includes ALL user data 
var currentUser

function submitSession() {
    console.log("inside submitSession");

    // constants for the user's input values
    let exerciseName = document.getElementById('drop').value;
    let weightValue = document.getElementById('weightInput').value;
    let setsValue = document.getElementById('setsInput').value;
    let repsValue = document.getElementById('repsInput').value;

    // NEED TO UPDATE BASED ON DB FILE STRUCTURE ON FIRESTORE
    // Example of specifying the path to the subcollection:
        // const parentDocRef = db.collection('parentCollection').doc(parentDocID);
        // parentDocRef.collection(subcollectionName).add({ ..... })

    // adds inputs to the user's "workouts" collection
    // should i add an if 'user' else 'error: please sign in'?
    db.collection('workouts').add({
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


