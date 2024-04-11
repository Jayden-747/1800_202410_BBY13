firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in, call the function
    updateSessionNumber();
  } else {
    console.log("No user is currently logged in.");
    // Handle the case when no user is logged in
  }
});

/**
 * Updates the nuber of workouts done on the home page.
 */
function updateSessionNumber() {
  const user = firebase.auth().currentUser;
  if (user) {
    // Reference to the user's "workouts" collection
    const workoutsRef = db
      .collection("users")
      .doc(user.uid)
      .collection("workouts");
    console.log(user);
    // Initialize counter variable
    let numberOfWorkouts = 0;

    // Get the documents in the "workouts" collection
    workoutsRef
      .get()
      .then((querySnapshot) => {
        // Iterate through each document in the query snapshot
        querySnapshot.forEach((doc) => {
          // Increment the counter for each document
          numberOfWorkouts++;
        });
        console.log(numberOfWorkouts);

        // Update the HTML element with the number of workouts
        const sessionNumberElement = document.getElementById("session-number");
        if (sessionNumberElement) {
          sessionNumberElement.textContent = numberOfWorkouts.toString();
        } else {
          console.error("Element with ID 'session-number' not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching number of workouts:", error);
      });
  } else {
    console.log("No user");
  }
}

// Initialize myChart variable
let myChart;

// Listen for authentication state changes
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is logged in, proceed with fetching user data
    const userStatsRef = db.collection("users").doc(user.uid);
    userStatsRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userStats = doc.data();
          // Update yValues array with user's stats for Strength, Stamina, and Speed
          const updatedYValues = [
            userStats.Strength || 0,
            userStats.Stamina || 0,
            userStats.Speed || 0,
          ];
          // Update the chart data if myChart is initialized
          if (myChart) {
            myChart.data.datasets[0].data = updatedYValues;
            myChart.update();
          }
        } else {
          console.log("User document does not exist.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user document:", error);
      });
  } else {
    console.log("No user is currently logged in.");
  }
});

// Initialize the chart
var xValues = ["Strength", "Stamina", "Speed"];
var yValues = [55, 49, 44];
var barColors = ["#b91d47", "#00aba9", "#2b5797"];
Chart.defaults.global.defaultFontSize = 20;

myChart = new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [
      {
        backgroundColor: barColors,
        data: yValues,
      },
    ],
  },
  options: {
    legend: {
      labels: {
        fontColor: "white", // Change legend font color
      },
    },
    title: {
      display: true,
      text: "Stats",
      fontColor: "white",
    },
  },
});
