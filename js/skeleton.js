//---------------------------------------------------
// This function loads the parts of your skeleton
// (navbar, footer, and other things) into html doc.
//---------------------------------------------------
/**
 * Loads the navbar onto each page
 */
function loadSkeleton() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      //if the pointer to "user" object is not null, then someone is logged in
      // User is signed in.
      // Do something for the user here.
      console.log($("#navbar").load("./text/navbar.html"));
      console.log($("#footerPlaceholder").load("./text/footer.html"));
    } else {
      // No user is signed in.
      console.log($("#navbar").load("./text/navbar-before-login.html"));
      console.log($("#footerPlaceholder").load("./text/footer.html"));
    }
  });
}
loadSkeleton(); //invoke the function

/**
 * Logs the user out
 */
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("logging out user");
    })
    .catch((error) => {
      // An error happened.
    });
}
