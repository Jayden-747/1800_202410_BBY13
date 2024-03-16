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
function populateDrop () {
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