import { localStorageAuthTokenKey } from "./constants";

const resultSubmitFormElement = document.getElementById("result-submit-form");
const loserSelectElement = document.getElementById("loser");
const winnerSelectElement = document.getElementById("winner");

resultSubmitFormElement.addEventListener("submit", e => {
  const winner = document.getElementById("winner").value;
  const loser = document.getElementById("loser").value;

  fetch("/result", {
    method: "POST",
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

function _getUsers() {
  return fetch("/users/", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application.json",
      "x-auth": localStorage.getItem(localStorageAuthTokenKey)
    }
  })
    .then(resp => resp.json())
    .catch(console.log);
}

async function setResultOptions() {
  const users = await _getUsers();

  users.forEach(user => {
    const option = document.createElement("option");
    option.value = user.email;
    option.innerText = user.email;

    loserSelectElement.appendChild(option);
    winnerSelectElement.appendChild(option.cloneNode(true));
  });
}

export { setResultOptions };
