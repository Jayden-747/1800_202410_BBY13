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
