import { localStorageAuthTokenKey } from "./constants";

const resultSubmitFormElement = document.getElementById("result-submit-form");

resultSubmitFormElement.addEventListener("submit", e => {
  const winner = document.getElementById("winner").value;
  const loser = document.getElementById("loser").value;

  fetch("/result", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-auth": localStorage.getItem(localStorageAuthTokenKey)
    },
    body: JSON.stringify({ winner, loser })
  })
    .then(resp => resp.json())
    .then(console.log)
    .catch(console.log);
});
