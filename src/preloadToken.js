/**
 * preloadToken.js
 *
 * MUST be imported as the VERY FIRST import in main.jsx — before store.js
 * and authSlice.js. ES module imports are evaluated in order, so placing
 * this first guarantees that localStorage has the token written before
 * authSlice reads isLoggedIn() during its module initialisation.
 *
 * When Flutter opens the admin WebView with ?token=XYZ, this writes the
 * raw JWT to localStorage under the same key that authToken.js reads,
 * so isLoggedIn() returns true on the very first Redux hydration and
 * React Router never redirects to /auth before fetchMeData can complete.
 */

const TOKEN_ACCESS = "_k_e7c1fa92";
const TOKEN_LOGIN_SOURCE = "_k_ls_72ac91";

const params = new URLSearchParams(window.location.search);
const token = params.get("token") || params.get("access_token");

if (token) {
  localStorage.setItem(TOKEN_ACCESS, token);
  localStorage.setItem(TOKEN_LOGIN_SOURCE, "mobile");
  // Clean the token from the URL immediately so it isn't visible in history
  // and won't be re-processed on React Router navigation.
  const clean = window.location.pathname + window.location.hash;
  window.history.replaceState({}, document.title, clean);
}
