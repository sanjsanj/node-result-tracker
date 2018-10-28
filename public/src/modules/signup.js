import { localStorageAuthTokenKey, localStorageUserEmailKey } from "./constants";

const signupFormElement = document.getElementById("signup-form");
const signupEmailElement = document.getElementById("signup-email");
const signupPasswordElement = document.getElementById("signup-password");
const signupInviteCodeElement = document.getElementById("signup-invite-code");

signupFormElement.addEventListener("submit", e => {
  e.preventDefault();
  
  const email = signupEmailElement.value;
  const password = signupPasswordElement.value;
  const inviteCode = signupInviteCodeElement.value;

  fetch("/users/", {
    method: "POST",
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
      window.location.reload();
    })
    .catch(console.log);
});
