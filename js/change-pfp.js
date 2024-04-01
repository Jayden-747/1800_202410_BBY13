// Current pfp displayed on profile
const pfp = document.querySelectorAll(".pfp-set");
// Pfp options displayed in settings
const pfpChoices = document.querySelectorAll(".pfp");

var userNumber;
// Accesses User UID
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User logged in already or has just logged in.
    userNumber = user.uid;
    console.log(userNumber);
    // currentPfp(userNumber);
    db.collection("users")
      .doc(userNumber)
      .onSnapshot((pfpDoc) => {
        let newPfp = pfpDoc.data().profile_picture;
        document.querySelector(".pfp-set").src = newPfp;

        console.log(document.querySelector(".pfp-set"));
      });
  } else {
    // User not logged in or has just logged out.
  }
});

pfpChoices.forEach(function (choice) {
  choice.addEventListener("click", function () {
    let newPfp = choice.getAttribute("src");
    changePicture(newPfp);
    console.log(newPfp);
  });
});

function currentPfp(userNumber) {
  let newPfp = db.collection("users").doc(userNumber);
  console.log(newPfp);
}

function changePicture(newPfp) {
  db.collection("users").doc(userNumber).update({ profile_picture: newPfp });
}
