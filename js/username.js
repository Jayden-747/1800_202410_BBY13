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
        let username = pfpDoc.data().username;
        document.querySelector("#username").innerHTML = username;

        console.log(username);
      });
  } else {
    // User not logged in or has just logged out.
  }
});
