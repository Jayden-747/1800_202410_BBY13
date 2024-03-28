// Current pfp displayed on profile
const pfp = document.querySelectorAll(".pfp-set");
// Pfp options displayed in settings
const pfpChoices = document.querySelectorAll(".pfp");

pfpChoices.forEach(function (choice) {
  choice.addEventListener("click", function () {
    let newPfp = choice.getAttribute("src");
  });
});
