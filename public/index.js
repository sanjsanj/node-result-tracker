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
