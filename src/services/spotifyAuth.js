import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;  
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;  
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-read-private user-read-email playlist-modify-public playlist-modify-private`;

const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

const setSpotifyToken = (token) => {
  spotify.setAccessToken(token);
};

export default spotify;
export { loginUrl, getTokenFromUrl, setSpotifyToken };

