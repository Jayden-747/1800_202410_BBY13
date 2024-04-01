// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// Grabs the modal div
var modal = document.getElementById("username-modal");

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      var user = authResult.user;

      if (authResult.additionalUserInfo.isNewUser) {
        db.collection("users").doc(user.uid).set({
          name: user.displayName,
          email: user.email,
          profile_picture: "./images/pfp1",
          Speed: 0,
          Strength: 0,
          Stamina: 0,
        });
        db.collection("users").doc(user.uid).collection("workouts").add({});
        console.log("New user added to firestore");
        modal.style.display = "block";
        document
          .getElementById("submit")
          .addEventListener("click", function () {
            db.collection("users")
              .doc(user.uid)
              .update({
                username: document.getElementById("user-input").value,
              });
            window.location.assign("home.html");
            alert("username successfully set!");
          });
      } else {
        return true;
      }
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "home.html",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: "<your-tos-url>",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};

// The start method will wait until the DOM is loaded.
ui.start("#firebaseui-auth-container", uiConfig);
