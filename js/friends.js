var currentUser;

function userID() {
  firebase.auth().onAuthStateChanged((user) => {
    currentUser = user.uid;
    console.log(user.uid);
  });
}
userID();

document.getElementById("add-friend").addEventListener("click", function () {
  addFriend(document.getElementById("friend-input").value);
  console.log("friend added");
  console.log(document.getElementById("friend-input").value);
});

function addFriend(newFriend) {
  db.collection("users")
    .doc(currentUser)
    .update({
      friends: firebase.firestore.FieldValue.arrayUnion(newFriend),
    });
}
