import { localStorageAuthTokenKey, localStorageUserEmailKey } from "./constants";

function hasAuthToken() {
  return localStorage.getItem(localStorageAuthTokenKey) ? true : false;
}

function hasStoredEmail() {
  return localStorage.getItem(localStorageUserEmailKey) ? true : false;
}

export { hasAuthToken, hasStoredEmail };
