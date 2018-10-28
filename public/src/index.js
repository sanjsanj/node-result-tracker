import _ from "lodash";

const localStorageAuthTokenKey = "NodeResultTracker:x-auth";
const localStorageUserEmailKey = "NodeResultTracker:user-email";

const welcomeMessageElement = document.getElementById("welcome-message");

const signupFormElement = document.getElementById("signup-form");
const signupEmailElement = document.getElementById("signup-email");
const signupPasswordElement = document.getElementById("signup-password");
const signupInviteCodeElement = document.getElementById("signup-invite-code");

const loginFormElement = document.getElementById("login-form");
const loginEmailElement = document.getElementById("login-email");
const loginPasswordElement = document.getElementById("login-password");

const logoutFormElement = document.getElementById("logout-form");

const resultSubmitFormElement = document.getElementById("result-submit-form");
const winnerSelectElement = document.getElementById("winner");
const loserSelectElement = document.getElementById("loser");

const resultsWrapper = document.getElementById("results__wrapper");

const totalWrapper = document.getElementById("total__wrapper");

let users;

function hasAuthToken() {
  return localStorage.getItem(localStorageAuthTokenKey) ? true : false;
}

function hasStoredEmail() {
  return localStorage.getItem(localStorageUserEmailKey) ? true : false;
}

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
    .then(json => {
      users = json;
      setResultOptions();
    })
    .catch(console.log);
}

function setResultOptions() {
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

signupFormElement.addEventListener("submit", e => {
  const email = signupEmailElement.value;
  const password = signupPasswordElement.value;
  const inviteCode = signupInviteCodeElement.value;

  fetch("/users/", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password, inviteCode })
  })
    .then(resp => {
      if (resp.headers.get("x-auth")) {
        localStorage.setItem(
          localStorageAuthTokenKey,
          resp.headers.get("x-auth")
        );
      }

      return resp.json();
    })
    .then(user => {
      localStorage.setItem(localStorageUserEmailKey, email);
    })
    .catch(console.log);
});

loginFormElement.addEventListener("submit", e => {
  const email = loginEmailElement.value;
  const password = loginPasswordElement.value;

  fetch("/users/login/", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(resp => {
      const authToken = resp.headers.get("x-auth");

      if (authToken) localStorage.setItem(localStorageAuthTokenKey, authToken);

      return resp.json();
    })
    .then(user => {
      localStorage.setItem(localStorageUserEmailKey, email);
    })
    .catch(console.log);
});

logoutFormElement.addEventListener("submit", e => {
  fetch("/users/me/token/", {
    method: "delete",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-auth": localStorage.getItem(localStorageAuthTokenKey)
    }
  })
    .then(resp => {
      localStorage.removeItem(localStorageAuthTokenKey);
      localStorage.removeItem(localStorageUserEmailKey);
    })
    .catch(console.log);
});

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

resultsWrapper.addEventListener("click", function(e) {
  e.preventDefault();
  const target = e.target;
  const attr = target.getAttribute("data-id");

  console.log(target);
})