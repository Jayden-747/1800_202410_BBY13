const changeUserName = document.querySelector(".change-username");
const changeUserNameIcon = changeUserName.querySelector(".dropdown-icon");
// import { getAuth } from "firebase/auth";
const user = firebase.auth.currentUser;

function rotateIcon() {
  changeUserNameIcon.style.cssText =
    "transform: rotate(0deg); transition: 0.2s ease-in;";
  document.querySelector(".modal-container").style.display = "flex";
}

function unRotateIcon() {
  changeUserNameIcon.style.cssText =
    "transform: rotate(90deg); transition: 0.2s ease-in;";
  document.querySelector(".modal-container").style.display = "none";
}

document.addEventListener("mousedown", function (event) {
  if (changeUserName.contains(event.target)) {
    console.log("clicked");
    rotateIcon();
  } else if (!changeUserName.contains(event.target)) {
    unRotateIcon();
    console.log("clicked outside");
  }
});

document.getElementById("submit").addEventListener("click", function () {
  db.collection("users")
    .doc(user)
    .update({
      username: document.getElementById("user-input").value,
    });
  console.log("username set");
});
console.log(user);
