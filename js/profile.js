  
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
                let str = userDoc.data().Strength;
                let spd = userDoc.data().Speed;
                let sta = userDoc.data().Stamina;
                
                //if the data fields are not empty, then update width of the progress bar
                if (str != null) {
                    const bar1 = document.getElementById("strengthBar");
                    bar1.style.width = `${str}%`;
                }
                if (spd != null) {
                    const bar2 = document.getElementById("speedBar");
                    bar2.style.width = `${spd}%`;
                }
                if (sta != null) {
                    const bar3 = document.getElementById("staminaBar");
                    bar3.style.width = `${sta}%`;
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