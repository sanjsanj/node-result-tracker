import { localStorageAuthTokenKey, localStorageUserEmailKey } from "./constants";

const loginFormElement = document.getElementById("login-form");
const loginEmailElement = document.getElementById("login-email");
const loginPasswordElement = document.getElementById("login-password");

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
