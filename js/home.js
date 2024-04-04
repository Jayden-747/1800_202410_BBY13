function updateSessions() {
  let sessionsHTML = document.getElementById('session-number');

  // Check if user is signed in
  const user = firebase.auth().currentUser;
  if (!user) {
      console.log("User is not signed in.");
      return; // Exit the function if user is not signed in
  }

  // Reference to the workouts collection for the current user
  const workoutsRef = db.collection('users').doc(user.uid).collection('workouts');

  workoutsRef.get()
  .then((querySnapshot) => {
      const numberOfDocuments = querySnapshot.size;
      console.log("Total number of documents in 'workouts' collection under current user:", numberOfDocuments);
      // Update the inner HTML with the number of documents
      sessionsHTML.textContent = numberOfDocuments;
  })
  .catch((error) => {
      console.error("Error getting documents: ", error);
  });
}



var xValues = ["Strength", "Stamina", "Speed"];
var yValues = [55, 49, 44,];
var barColors = [
  "#b91d47",
  "#00aba9",
  "#2b5797"
];
Chart.defaults.global.defaultFontSize = 20;

new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {
      labels: {
        fontColor: 'white' // Change legend font color
      }
    },
    title: {
        display: true,
        text: "Stats",
        fontColor: 'white'
        
    }
}
});