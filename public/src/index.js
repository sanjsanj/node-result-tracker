import _ from "lodash";

import { localStorageUserEmailKey } from "./modules/constants";
import { hasAuthToken, hasStoredEmail } from "./modules/utils";
import { getResults } from "./modules/results";
import { setResultOptions } from "./modules/result-submit";

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

if (hasAuthToken()) {
  logoutFormElement.style.display = "block";
  resultSubmitFormElement.style.display = "block";

  setResultOptions();
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
