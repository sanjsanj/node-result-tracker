import _ from "lodash";

import {
  localStorageAuthTokenKey,
  localStorageUserEmailKey
} from "./modules/constants";
import { hasAuthToken, hasStoredEmail } from "./modules/utils";

import "./modules/signup";
import "./modules/login";
import "./modules/logout";
import "./modules/result-submit";
import "./modules/results";

const welcomeMessageElement = document.getElementById("welcome-message");
const signupFormElement = document.getElementById("signup-form");
const loginFormElement = document.getElementById("login-form");
const logoutFormElement = document.getElementById("logout-form");

const resultSubmitFormElement = document.getElementById("result-submit-form");
const winnerSelectElement = document.getElementById("winner");
const loserSelectElement = document.getElementById("loser");

const resultsWrapper = document.getElementById("results__wrapper");
const totalWrapper = document.getElementById("total__wrapper");

if (hasAuthToken()) {
  logoutFormElement.style.display = "block";
  resultSubmitFormElement.style.display = "block";

  getUsers();
  getResults();

  if (hasStoredEmail()) {
    welcomeMessageElement.innerHTML = `Welcome ${localStorage.getItem(
      localStorageUserEmailKey
    )}`;
    welcomeMessageElement.style.display = "block";
  }
} else {
  signupFormElement.style.display = "block";
  loginFormElement.style.display = "block";
}

function getUsers() {
  fetch("/users/", {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application.json",
      "x-auth": localStorage.getItem(localStorageAuthTokenKey)
    }
  })
    .then(resp => resp.json())
    .then(setResultOptions)
    .catch(console.log);
}

function setResultOptions(users) {
  users.forEach(user => {
    const option = document.createElement("option");
    option.value = user.email;
    option.innerText = user.email;

    loserSelectElement.appendChild(option);
    winnerSelectElement.appendChild(option.cloneNode(true));
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
      buildResults(results);
      buildTotal(results);
    })
    .catch(console.log);
}

function buildResults(results) {
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

function buildTotal(results) {
  const confirmedResults = results.filter(result => result.confirmed);
  const winners = _.uniq(confirmedResults.map(result => result.winner));
  const resultsObject = winners.reduce((acc, val) => {
    acc[val] = confirmedResults.filter(result => result.winner === val).length;
    return acc;
  }, {});

  winners.forEach(winner => {
    const text = document.createElement("p");
    text.innerText = `${winner}: ${resultsObject[winner]} wins`;
    totalWrapper.appendChild(text);
  });
}
