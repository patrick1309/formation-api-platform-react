import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * Requête HTTP authentification et stockage du token sur axios et localstoratge
 * @param {objet} credentials
 */
function authenticate(credentials) {
  return axios
    .post("http://localhost:8000/api/login_check", credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // stock token dans le local storage
      window.localStorage.setItem("authToken", token);

      // on previent axios qu'on a maintenant un header par défaut sur toutes nos futurs requetes HTTP
      setAxiosToken(token);

      return true;
    });
}

/**
 * Déconnexion, supprime le token du localstorate et Axios
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 * enregistre le token dans axios
 * @param {string} token le token jwt
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
  // 1. voir si token ?
  const token = window.localStorage.getItem("authToken");

  // 2. voir si valide
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
  // 1. voir si token ?
  const token = window.localStorage.getItem("authToken");

  // 2. voir si valide
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
  }

  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
};
