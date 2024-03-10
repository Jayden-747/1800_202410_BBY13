const changeUserName = document.querySelector(".change-username");
const changeUserNameIcon = changeUserName.querySelector(".dropdown-icon");
const modal = document.querySelector(".modal-container");
// import { getAuth } from "firebase/auth";
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
  content.style.display = "none";
}

/*
Change Username dropdown animation trigger.
*/
document.addEventListener("mousedown", function (event) {
  if (changeUserName.contains(event.target)) {
    console.log("clicked");
    open(changeUserName, changeUserNameIcon, modal, "230px");
  } else if (!changeUserName.contains(event.target)) {
    close(changeUserName, changeUserNameIcon);
    console.log("clicked outside");
  }
});

/*
Changes the username to the given username on "Submit" button press 
or click of the "Enter" button 
*/
document.getElementById("submit").addEventListener("click", function () {
  db.collection("users")
    .doc(user)
    .update({
      username: document.getElementById("user-input").value,
    });
  console.log("username set");
});
console.log(user);
