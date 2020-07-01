import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
ReactDOM.render(
  <GoogleReCaptchaProvider reCaptchaKey="6LeLUKsZAAAAAPB43elKl409zP_itTlNq6LXHtDf">
    <App />
  </GoogleReCaptchaProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
