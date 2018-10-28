import { localStorageAuthTokenKey } from "./constants";
import { buildTotal } from "./total";

const resultsWrapper = document.getElementById("results__wrapper");

resultsWrapper.addEventListener("click", async e => {
  e.preventDefault();
  const id = e.target.getAttribute("data-id");
  const type = e.target.getAttribute("data-type");
  const config =
    type === "confirm"
      ? { method: "PATCH", path: "/result/confirm" }
      : { method: "DELETE", path: "/result" };

  const fetchOptions = {
    method: config.method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-auth": localStorage.getItem(localStorageAuthTokenKey)
    }
  };

  if (window.confirm(`Are you sure you want to ${type.toUpperCase()} this result?`)) {
    await fetch(`${config.path}/${id}`, fetchOptions);
    window.location.reload();
  }
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
      deleteBtn.innerText = "DELETE";
      deleteBtn.className = "delete-result";
      deleteBtn.setAttribute("data-id", result._id);
      deleteBtn.setAttribute("data-type", "delete");

      resultContainer.appendChild(confirmBtn);
      resultContainer.appendChild(deleteBtn);
      resultsWrapper.appendChild(resultContainer);
    });
}

function getResults() {
  fetch("/results/", {
    method: "GET",
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
