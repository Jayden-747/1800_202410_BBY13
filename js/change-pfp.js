// Current pfp displayed on profile
const pfp = document.querySelectorAll(".pfp-set");
// Pfp options displayed in settings
const pfpChoices = document.querySelectorAll(".pfp");

let userNumber;
// Accesses User UID
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User logged in already or has just logged in.
    console.log(user.uid);
    userNumber = user.uid;

  } else {
    // User not logged in or has just logged out.
  }
});

pfpChoices.forEach(function (choice) {
  choice.addEventListener("click", function () {
    let newPfp = choice.getAttribute("src");
    changePicture(newPfp);
    console.log(newPfp);
    currentPfp();
  });
});

function currentPfp() {
  db.collection("users")
    .doc(userNumber)
    .get()
    .then((doc) => {
      newPfp = doc.get("profile_picture");
      console.log(newPfp);
    });
}
currentPfp();

function changePicture(newPfp) {
  db.collection("users").doc(userNumber).update({ profile_picture: newPfp });
}



// Grabs stat fields from users that are logged in and updates the progress bars' width to match
function updateBar() {
  firebase.auth().onAuthStateChanged((user) => {
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


            })
          } else {
              // No user is signed in.
              console.log("No user is signed in");
          }
    });
}

updateBar();