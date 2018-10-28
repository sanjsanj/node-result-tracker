const resultsWrapper = document.getElementById("results__wrapper");

resultsWrapper.addEventListener("click", function(e) {
  e.preventDefault();
  const target = e.target;
  console.log(target);
});
