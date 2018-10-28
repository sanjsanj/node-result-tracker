import { localStorageAuthTokenKey, localStorageUserEmailKey } from "./constants";

const logoutFormElement = document.getElementById("logout-form");

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
