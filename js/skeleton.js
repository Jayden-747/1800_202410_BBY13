//---------------------------------------------------
// This function loads the parts of your skeleton
// (navbar, footer, and other things) into html doc.
//---------------------------------------------------
function loadSkeleton() {
  console.log($("#navbar").load("./text/navbar.html"));
  console.log($("#footerPlaceholder").load("./text/footer.html"));
}
loadSkeleton(); //invoke the function