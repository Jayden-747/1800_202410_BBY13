function dataExercise() {
    var exerRef = db.collection("exercises");

    exerRef.add({
        name: "Sprints",
        type: "Speed",
        points: 4

    });

    exerRef.add({
        name: "Deadlift",
        type: "Strength",
        points: 4

    });

    exerRef.add({
        name: "Barbell Bench Press",
        type: "Strength",
        points: 3

    });

    exerRef.add({
        name: "10 min Jog",
        type: "Stamina",
        points: 2

    });

    exerRef.add({
        name: "20 min Jog",
        type: "Stamina",
        points: 3

    });

    exerRef.add({
        name: "30 min Jog",
        type: "Stamina",
        points: 4

    });

    exerRef.add({
        name: "Squats",
        type: "Strength",
        points: 4

    });

    exerRef.add({
        name: "Sled Push",
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

// Add event listener to the add button that stores exercise chosen and amount of sets and reps to a user

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

