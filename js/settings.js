const user = firebase.auth.currentUser;

/* 
Makes the div expand to the desired height with an animation
element = html element to change 
arrow = the arrow to be rotated 
content = the element inside the setting option
height = the height the animation ends at 
*/
function open(element, arrow, content, height) {
  element.style.cssText =
    "height: " + height + "; transition: height 0.2s ease-in;";
  arrow.style.cssText = "transform: rotate(0deg); transition: 0.2s ease-in;";
  content.style.display = "flex";
}

/* 
Closes the div when clicked outside of
element = html element to change 
arrow = the arrow to be rotated 
content = the element inside the setting option
*/
function close(element, arrow, content) {
  element.style.cssText = "height: 45px; transition: height 0.2s ease-in;";
  arrow.style.cssText = "transform: rotate(90deg); transition: 0.2s ease-in;";
  setTimeout(function () {
    content.style.display = "none";
  }, 200); // 200 milliseconds = 0.2 seconds
}

const changeUserName = document.querySelector(".change-username");
const changeUserNameIcon = changeUserName.querySelector(".dropdown-icon");
const modal = document.querySelector(".modal-container");
/*
Change Username dropdown animation trigger.
*/
document.addEventListener("mousedown", function (event) {
  if (changeUserName.contains(event.target)) {
    console.log("clicked");
    open(changeUserName, changeUserNameIcon, modal, "230px");
  } else if (!changeUserName.contains(event.target)) {
    close(changeUserName, changeUserNameIcon, modal);
    console.log("clicked outside");
  }
});

/*
Changes the username to the given username on "Submit" button press 
or click of the "Enter" button 
*/
document.getElementById("submit").addEventListener("click", function () {
  db.collection("users")
    .doc(userID)
    .update({
      username: document.getElementById("user-input").value,
    });
  console.log("username set");
  performAction();
});

let userID;
// Accesses User UID
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User logged in already or has just logged in.
    console.log(user.uid);
    userID = user.uid;
  } else {
    // User not logged in or has just logged out.
  }
});

const changePfp = document.querySelector(".change-pfp");
const changePfpIcon = changePfp.querySelector(".dropdown-icon");
const pfpContainer = document.querySelector(".pfp-container");

/*
Change Profile Picture dropdown animation trigger.
*/
document.addEventListener("mousedown", function (event) {
  if (changePfp.contains(event.target)) {
    console.log("clicked");
    open(changePfp, changePfpIcon, pfpContainer, "300px");
  } else if (!changePfp.contains(event.target)) {
    close(changePfp, changePfpIcon, pfpContainer);
    console.log("clicked outside");
  }
});
