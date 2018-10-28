import { localStorageAuthTokenKey } from "./constants";
import { buildTotal } from "./total";

const resultsWrapper = document.getElementById("results__wrapper");

resultsWrapper.addEventListener("click", function(e) {
  e.preventDefault();
  const target = e.target;
  console.log(target);
});

function _buildResults(results) {
  results
    .filter(result => !result.confirmed)
    .sort((a, b) => b.submittedAt - a.submittedAt)
    .forEach(result => {
      const resultContainer = document.createElement("div");
      resultContainer.innerText = `Winner: ${result.winner}, Loser: ${
        result.loser
      }`;

      const confirmBtn = document.createElement("button");
      confirmBtn.type = "submit";
      confirmBtn.innerText = "Confirm";
      confirmBtn.className = "confirm-result";
      confirmBtn.setAttribute("data-id", result._id);
      confirmBtn.setAttribute("data-type", "confirm");

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "submit";
      deleteBtn.innerText = "Delete";
      deleteBtn.className = "delete-result";
      deleteBtn.setAttribute("data-id", result._id);
      deleteBtn.setAttribute("data-type", "confirm");

      resultContainer.appendChild(confirmBtn);
      resultContainer.appendChild(deleteBtn);
      resultsWrapper.appendChild(resultContainer);
    });
}

function getResults() {
  fetch("/results/", {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-auth": localStorage.getItem(localStorageAuthTokenKey)
    }
  })
    .then(resp => resp.json())
    .then(json => {
      const results = json.results;
      _buildResults(results);
      buildTotal(results);
    })
    .catch(console.log);
}

export { getResults };
