  
// Grabs stat fields from users that are logged in and updates the progress bars' width to match 
function updateBar() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
        //go to the correct user document by referencing to the user uid
        currentUser = db.collection("users").doc(user.uid) 
        //get the document for current user.
        currentUser.get()
            .then(userDoc => {
                //get the data fields of the user
                //Calculates user total xp from all 3 points stats
                let str = userDoc.data().Strength;
                let spd = userDoc.data().Speed;
                let sta = userDoc.data().Stamina;
                let totalXP = str + spd +sta;
                let totalLVL = Math.floor(totalXP / 100);
                let totalBar = totalXP % 100;
                let totalLVL_HTML = document.getElementById("totalLVL");
                let totalXP_HTML = document.getElementById("levelXP");
                let totalProgress = document.getElementById("totalBar")
                totalLVL_HTML.innerHTML = totalLVL;
                totalXP_HTML.innerHTML = totalBar;
                totalProgress.style.width = `${totalBar}%`;
                //if the data fields are not empty, then update width of the progress bar
                if (str != null) {
                    let bar1 = document.getElementById("strengthBar");
                    let strLevel_HTML = document.getElementById("strLVL");
                    let strXP_HTML = document.getElementById("strengthXP");
                    let strLVL = Math.floor(str / 100);
                    let strXP = str % 100;
                    strLevel_HTML.innerHTML = strLVL;
                    strXP_HTML.innerHTML = strXP;
                    bar1.style.width = `${strXP}%`;
                }
                if (spd != null) {
                    let bar2 = document.getElementById("speedBar");
                    let spdLevel_HTML = document.getElementById("spdLVL");
                    let spdXP_HTML = document.getElementById("speedXP");
                    let spdLVL = Math.floor(spd / 100);
                    let spdXP = spd % 100;
                    spdLevel_HTML.innerHTML = spdLVL;
                    spdXP_HTML.innerHTML = spdXP;
                    bar2.style.width = `${spdXP}%`;
                }
                if (sta != null) {
                    let bar3 = document.getElementById("staminaBar");
                    let staLevel_HTML = document.getElementById("staLVL");
                    let staXP_HTML = document.getElementById("staminaXP");
                    let staLVL = Math.floor(sta / 100);
                    let staXP = sta % 100;
                    staLevel_HTML.innerHTML = staLVL;
                    staXP_HTML.innerHTML = staXP;
                    bar3.style.width = `${staXP}%`;
                }
            })
    } else {
        // No user is signed in.
        console.log ("No user is signed in");
    }
});
}
                
  // Call the function to initially update the progress bar
  updateBar();

//Retrieve workouts collection of user and display in previous workouts HTML
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const workoutsRef = db.collection('users').doc(user.uid).collection('workouts');

        // Query the workouts collection and order by date
        workoutsRef.orderBy('date', 'desc').get().then((querySnapshot) => {
            //selects the list
            const workoutsContainer = document.querySelector('.friends-list');
            //clears the html of the list
            // workoutsContainer.innerHTML = '';
            querySnapshot.forEach((doc) => {
                // Get data from each document
                const data = doc.data();

                // Extract the fields from workout document
                const workoutName = data.exercise;
                const workoutDate = data.date.toDate().toLocaleDateString(); 
                const set = data.sets;
                const rep = data.reps;
                const weight = data.weight;
                const duration = data.duration;
                // Create html elements to display the extracted fields
                const workoutListItem = document.createElement('li');
                workoutListItem.classList.add('friend'); // Add class to match your HTML structure
                workoutListItem.innerHTML = `
                    <p><strong>Exercise:</strong> ${workoutName}</p>
                    <p><strong>Sets:</strong> ${set}</p>
                    <p><strong>Reps:</strong> ${rep}</p>
                    <p><strong>Weight:</strong> ${weight}</p>
                    
                `;

                workoutListItem.querySelectorAll('p').forEach(p => {
                    p.style.margin = '5px 0';

                });

                // Prepend the new list item to the list
                workoutsContainer.prepend(workoutListItem);

            });
        })
    } else {
        // User is not signed in. Handle accordingly.
        console.log("User not signed in.");
    }
});